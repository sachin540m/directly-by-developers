<?php
/**
 * PHPMailer RFC821 SMTP class.
 * PHP Version 5.5+
 * @package PHPMailer
 * @license http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License
 */

namespace PHPMailer\PHPMailer;

/**
 * PHPMailer RFC821 SMTP class.
 * Implements RFC 821 SMTP protocol and provides connection handling, TLS, and AUTH.
 */
class SMTP
{
    const VERSION = '6.9.1';
    const LE = "\r\n";
    const DEFAULT_PORT = 25;
    const MAX_LINE_LENGTH = 998;
    const MAX_REPLY_LENGTH = 512;
    const DEBUG_OFF = 0;
    const DEBUG_CLIENT = 1;
    const DEBUG_SERVER = 2;
    const DEBUG_CONNECTION = 3;
    const DEBUG_LOWLEVEL = 4;

    public $do_debug = self::DEBUG_OFF;
    public $Debugoutput = 'echo';
    public $do_verp = false;
    public $Timeout = 300;
    public $Timelimit = 300;
    protected $smtp_conn;
    protected $error = ['error' => '', 'detail' => '', 'smtp_code' => '', 'smtp_code_ex' => ''];
    protected $helo_rply;
    protected $server_caps;
    protected $last_reply = '';

    protected function edebug($str, $level = 0)
    {
        if ($level > $this->do_debug) {
            return;
        }
        if (is_callable($this->Debugoutput)) {
            call_user_func($this->Debugoutput, $str, $level);
            return;
        }
        echo $str . "\n";
    }

    public function connect($host, $port = null, $timeout = 30, $options = [])
    {
        $this->setError('');
        if ($this->connected()) {
            $this->setError('Already connected to a server');
            return false;
        }
        if (empty($port)) {
            $port = self::DEFAULT_PORT;
        }
        $this->edebug("Connection: opening to {$host}:{$port}, timeout={$timeout}, options=" . var_export($options, true), self::DEBUG_CONNECTION);

        $socket_context = stream_context_create($options);
        set_error_handler([$this, 'errorHandler']);
        $this->smtp_conn = stream_socket_client(
            $host . ':' . $port,
            $errno,
            $errstr,
            $timeout,
            STREAM_CLIENT_CONNECT,
            $socket_context
        );
        restore_error_handler();

        if (!is_resource($this->smtp_conn)) {
            $this->setError('Failed to connect to server', '', (string)$errno, $errstr);
            $this->edebug("SMTP ERROR: {$this->error['error']}: {$errstr} ({$errno})", self::DEBUG_CLIENT);
            return false;
        }

        $this->edebug('Connection: opened', self::DEBUG_CONNECTION);

        // Set stream timeout
        stream_set_timeout($this->smtp_conn, $timeout, 0);

        // Read greeting
        $announce = $this->get_lines();
        $this->edebug('SERVER -> CLIENT: ' . $announce, self::DEBUG_SERVER);

        return $this->parseHelloFields($this->errorHandlerReplyCode($announce));
    }

    protected function parseHelloFields($code)
    {
        return $code === 220;
    }

    protected function errorHandlerReplyCode($str)
    {
        return (int)substr($str, 0, 3);
    }

    public function startTLS()
    {
        if (!$this->sendCommand('STARTTLS', 'STARTTLS', 220)) {
            return false;
        }

        $crypto_method = STREAM_CRYPTO_METHOD_TLS_CLIENT |
            STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT |
            (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT') ? STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT : 0);

        set_error_handler([$this, 'errorHandler']);
        $crypto_ok = stream_socket_enable_crypto($this->smtp_conn, true, $crypto_method);
        restore_error_handler();

        return (bool)$crypto_ok;
    }

    public function authenticate($user, $pass, $authtype = null, $OAuth = null)
    {
        if (!$this->server_caps) {
            $this->setError('No hello response received');
            return false;
        }

        $this->sendCommand('AUTH LOGIN', 'AUTH LOGIN', 334);
        if ($this->getLastReplyCode() !== 334) {
            return false;
        }

        $this->sendCommand('User name', base64_encode($user), 334);
        if ($this->getLastReplyCode() !== 334) {
            return false;
        }

        $this->sendCommand('Password', base64_encode($pass), 235);
        return $this->getLastReplyCode() === 235;
    }

    public function connected()
    {
        if (is_resource($this->smtp_conn)) {
            $sock_status = stream_get_meta_data($this->smtp_conn);
            if ($sock_status['eof']) {
                $this->edebug('SMTP NOTICE: EOF caught while checking if connected', self::DEBUG_CLIENT);
                $this->close();
                return false;
            }
            return true;
        }
        return false;
    }

    public function close()
    {
        $this->setError('');
        $this->server_caps = null;
        $this->helo_rply = null;
        if (is_resource($this->smtp_conn)) {
            fclose($this->smtp_conn);
            $this->smtp_conn = null;
            $this->edebug('Connection: closed', self::DEBUG_CONNECTION);
        }
    }

    public function hello($host = '')
    {
        return $this->sendHello('EHLO', $host) || $this->sendHello('HELO', $host);
    }

    protected function sendHello($hello, $host)
    {
        $noerror = $this->sendCommand($hello, $hello . ' ' . $host, 250);
        $this->helo_rply = $this->last_reply;
        if ($noerror) {
            $this->parseHelloFieldsFull();
        } else {
            $this->server_caps = null;
        }
        return $noerror;
    }

    protected function parseHelloFieldsFull()
    {
        $this->server_caps = [];
        $lines = explode("\n", $this->helo_rply);
        foreach ($lines as $n => $s) {
            $s = trim(substr($s, 4));
            if (empty($s)) {
                continue;
            }
            $fields = explode(' ', $s);
            if (!empty($fields[0])) {
                $name = strtoupper($fields[0]);
                if (1 === count($fields)) {
                    $this->server_caps[$name] = true;
                } else {
                    array_shift($fields);
                    $this->server_caps[$name] = $fields;
                }
            }
        }
    }

    public function mail($from)
    {
        return $this->sendCommand('MAIL FROM', 'MAIL FROM:<' . $from . '>', 250);
    }

    public function recipient($address, $dsn = '')
    {
        return $this->sendCommand('RCPT TO', 'RCPT TO:<' . $address . '>', [250, 251]);
    }

    public function data()
    {
        return $this->sendCommand('DATA', 'DATA', 354);
    }

    public function quit($close_on_error = true)
    {
        $noerror = $this->sendCommand('QUIT', 'QUIT', 221);
        $err = $this->error;
        if ($noerror || $close_on_error) {
            $this->close();
            $this->error = $err;
        }
        return $noerror;
    }

    public function client_send($data, $checknl = true)
    {
        $this->edebug('CLIENT -> SERVER: ' . ($checknl ? $data : str_replace(["\r", "\n"], ['\\r', '\\n'], $data)), self::DEBUG_LOWLEVEL);
        return fwrite($this->smtp_conn, $data);
    }

    public function dataSend($msg)
    {
        $lines = explode("\n", str_replace(["\r\n", "\r"], "\n", $msg));
        $formatted = '';
        foreach ($lines as $line) {
            if (isset($line[0]) && $line[0] === '.') {
                $formatted .= '.';
            }
            $formatted .= $line . self::LE;
        }
        $formatted .= '.' . self::LE;

        $this->client_send($formatted);
        $this->last_reply = $this->get_lines();
        $this->edebug('SERVER -> CLIENT: ' . $this->last_reply, self::DEBUG_SERVER);

        $matches = [];
        if (preg_match('/^([0-9]{3})[ -](.+)$/s', $this->last_reply, $matches)) {
            $code = (int)$matches[1];
            $text = $matches[2];
            $this->error = ['error' => '', 'detail' => '', 'smtp_code' => $code, 'smtp_code_ex' => ''];
            return $code === 250;
        }
        $this->setError('DATA delivery failed: ' . $this->last_reply);
        return false;
    }

    public function sendCommand($command, $commandstring, $expect)
    {
        if (!$this->connected()) {
            $this->setError("Called {$command}() without being connected");
            return false;
        }
        $this->client_send($commandstring . self::LE);
        $this->last_reply = $this->get_lines();
        $this->edebug('SERVER -> CLIENT: ' . $this->last_reply, self::DEBUG_SERVER);
        $matches = [];
        if (preg_match('/^([0-9]{3})[ -](.+)$/s', $this->last_reply, $matches)) {
            $code = (int)$matches[1];
            $text = $matches[2];
            $this->error = ['error' => '', 'detail' => '', 'smtp_code' => $code, 'smtp_code_ex' => ''];
        } else {
            $code = 0;
            $text = $this->last_reply;
            $this->setError('Unexpected reply from server: ' . $this->last_reply);
        }
        if (is_array($expect)) {
            if (in_array($code, $expect, true)) {
                return true;
            }
        } elseif ($code === $expect) {
            return true;
        }
        $this->setError("{$command} command failed", $text, (string)$code);
        return false;
    }

    protected function get_lines()
    {
        if (!is_resource($this->smtp_conn)) {
            return '';
        }
        $data = '';
        $endtime = 0;
        stream_set_timeout($this->smtp_conn, $this->Timeout);
        if ($this->Timelimit > 0) {
            $endtime = time() + $this->Timelimit;
        }
        $selR = [$this->smtp_conn];
        $selW = null;
        while (is_resource($this->smtp_conn) && !feof($this->smtp_conn)) {
            set_error_handler([$this, 'errorHandler']);
            $n = stream_select($selR, $selW, $selW, $this->Timelimit);
            restore_error_handler();
            if ($n === false) {
                break;
            }
            if ($n === 0) {
                break;
            }
            $str = @fgets($this->smtp_conn, self::MAX_REPLY_LENGTH);
            $data .= $str;
            if (!isset($str[3]) || $str[3] === ' ' || $str[3] === "\r" || $str[3] === "\n") {
                break;
            }
            $info = stream_get_meta_data($this->smtp_conn);
            if ($info['timed_out']) {
                break;
            }
            if ($endtime && time() > $endtime) {
                break;
            }
        }
        return $data;
    }

    public function setError($message, $detail = '', $smtp_code = '', $smtp_code_ex = '')
    {
        $this->error = [
            'error' => $message,
            'detail' => $detail,
            'smtp_code' => $smtp_code,
            'smtp_code_ex' => $smtp_code_ex,
        ];
    }

    public function getError()
    {
        return $this->error;
    }

    public function getLastReply()
    {
        return $this->last_reply;
    }

    public function getLastReplyCode()
    {
        return $this->error['smtp_code'];
    }

    public function errorHandler($errno, $errmsg, $errfile = '', $errline = 0)
    {
        $this->setError('Stream error: ' . $errmsg, '', (string)$errno);
        return true;
    }
}
