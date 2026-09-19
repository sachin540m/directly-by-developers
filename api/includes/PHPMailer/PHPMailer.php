<?php
/**
 * PHPMailer - PHP email creation and transport class.
 * PHP Version 5.5+
 * @package PHPMailer
 * @license http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License
 */

namespace PHPMailer\PHPMailer;

/**
 * PHPMailer class.
 */
class PHPMailer
{
    const CHARSET_ISO88591 = 'iso-8859-1';
    const CHARSET_UTF8 = 'utf-8';
    const CONTENT_TYPE_PLAINTEXT = 'text/plain';
    const CONTENT_TYPE_TEXT_HTML = 'text/html';
    const CONTENT_TYPE_MULTIPART_ALT = 'multipart/alternative';
    const ENCODING_BASE64 = 'base64';
    const ENCODING_8BIT = '8bit';
    const ENCRYPTION_STARTTLS = 'tls';
    const ENCRYPTION_SMTPS = 'ssl';

    public $CharSet = self::CHARSET_UTF8;
    public $ContentType = self::CONTENT_TYPE_TEXT_HTML;
    public $Encoding = self::ENCODING_BASE64;
    public $From = 'root@localhost';
    public $FromName = 'Root User';
    public $Sender = '';
    public $Subject = '';
    public $Body = '';
    public $AltBody = '';
    public $WordWrap = 0;
    public $Mailer = 'smtp';
    public $Host = 'localhost';
    public $Port = 25;
    public $Helo = '';
    public $SMTPSecure = '';
    public $SMTPAutoTLS = true;
    public $SMTPAuth = false;
    public $SMTPOptions = [];
    public $Username = '';
    public $Password = '';
    public $AuthType = '';
    public $Timeout = 300;
    public $SMTPDebug = 0;
    public $Debugoutput = 'echo';

    protected $smtp = null;
    protected $to = [];
    protected $cc = [];
    protected $bcc = [];
    protected $ReplyTo = [];
    protected $all_recipients = [];
    protected $CustomHeader = [];
    protected $message_type = '';
    protected $boundary = [];
    protected $language = [];
    protected $error_count = 0;
    protected $ErrorInfo = '';
    protected $exceptions = false;

    public function __construct($exceptions = null)
    {
        if (null !== $exceptions) {
            $this->exceptions = (bool)$exceptions;
        }
    }

    public function isSMTP()
    {
        $this->Mailer = 'smtp';
    }

    public function isHTML($isHtml = true)
    {
        if ($isHtml) {
            $this->ContentType = self::CONTENT_TYPE_TEXT_HTML;
        } else {
            $this->ContentType = self::CONTENT_TYPE_PLAINTEXT;
        }
    }

    public function setFrom($address, $name = '', $auto = true)
    {
        $address = trim((string)$address);
        $name = trim((string)$name);
        // Header injection prevention: reject/strip newlines
        $address = str_replace(["\r", "\n"], '', $address);
        $name = str_replace(["\r", "\n"], '', $name);

        if (!static::validateAddress($address)) {
            $this->setError('Invalid From address: ' . $address);
            if ($this->exceptions) {
                throw new Exception('Invalid From address: ' . $address);
            }
            return false;
        }
        $this->From = $address;
        $this->FromName = $name;
        if ($auto && empty($this->Sender)) {
            $this->Sender = $address;
        }
        return true;
    }

    public function addAddress($address, $name = '')
    {
        return $this->addOrEnqueueAnAddress('to', $address, $name);
    }

    public function addReplyTo($address, $name = '')
    {
        return $this->addOrEnqueueAnAddress('ReplyTo', $address, $name);
    }

    protected function addOrEnqueueAnAddress($kind, $address, $name = '')
    {
        $address = trim((string)$address);
        $name = trim((string)$name);
        $address = str_replace(["\r", "\n"], '', $address);
        $name = str_replace(["\r", "\n"], '', $name);

        if (!static::validateAddress($address)) {
            $this->setError('Invalid address: ' . $address);
            if ($this->exceptions) {
                throw new Exception('Invalid address: ' . $address);
            }
            return false;
        }

        if ('ReplyTo' === $kind) {
            $this->ReplyTo[strtolower($address)] = [$address, $name];
            return true;
        }

        $this->to[] = [$address, $name];
        $this->all_recipients[strtolower($address)] = true;
        return true;
    }

    public static function validateAddress($address)
    {
        return (bool)filter_var($address, FILTER_VALIDATE_EMAIL);
    }

    public function send()
    {
        try {
            if (!$this->preSend()) {
                return false;
            }
            return $this->postSend();
        } catch (Exception $exc) {
            $this->setError($exc->getMessage());
            if ($this->exceptions) {
                throw $exc;
            }
            return false;
        }
    }

    public function preSend()
    {
        if (empty($this->to)) {
            throw new Exception('You must provide at least one recipient email address.');
        }

        if (empty($this->From) || !static::validateAddress($this->From)) {
            throw new Exception('Empty or invalid From email address.');
        }

        return true;
    }

    public function postSend()
    {
        if ($this->Mailer === 'smtp') {
            return $this->smtpSend();
        }
        throw new Exception('Only SMTP mailer is supported in this configuration.');
    }

    protected function smtpSend()
    {
        $this->smtp = new SMTP();
        $this->smtp->do_debug = $this->SMTPDebug;
        $this->smtp->Debugoutput = $this->Debugoutput;
        $this->smtp->Timeout = $this->Timeout;

        $host = $this->Host;
        $port = $this->Port;

        $tls = ($this->SMTPSecure === self::ENCRYPTION_STARTTLS);
        $ssl = ($this->SMTPSecure === self::ENCRYPTION_SMTPS);

        $socketHost = ($ssl && !str_starts_with($host, 'ssl://')) ? 'ssl://' . $host : $host;

        $options = $this->SMTPOptions ?: [
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'allow_self_signed' => false
            ]
        ];

        if (!$this->smtp->connect($socketHost, $port, $this->Timeout, $options)) {
            throw new Exception('SMTP connect() failed: ' . $this->smtp->getError()['error']);
        }

        $helo = $this->Helo ?: ($_SERVER['SERVER_NAME'] ?? 'directlybydevelopers.com');
        if (!$this->smtp->hello($helo)) {
            $this->smtp->close();
            throw new Exception('SMTP HELO/EHLO failed: ' . $this->smtp->getError()['error']);
        }

        if ($tls) {
            if (!$this->smtp->startTLS()) {
                $this->smtp->close();
                throw new Exception('SMTP STARTTLS failed: ' . $this->smtp->getError()['error']);
            }
            if (!$this->smtp->hello($helo)) {
                $this->smtp->close();
                throw new Exception('SMTP HELO after STARTTLS failed: ' . $this->smtp->getError()['error']);
            }
        }

        if ($this->SMTPAuth) {
            if (!$this->smtp->authenticate($this->Username, $this->Password)) {
                $this->smtp->close();
                throw new Exception('SMTP authentication failed. Please verify credentials.');
            }
        }

        // Sender
        if (!$this->smtp->mail($this->From)) {
            $this->smtp->close();
            throw new Exception('MAIL FROM failed: ' . $this->smtp->getError()['error']);
        }

        // Recipients
        foreach ($this->to as $toArr) {
            if (!$this->smtp->recipient($toArr[0])) {
                $this->smtp->close();
                throw new Exception('RCPT TO failed for ' . $toArr[0] . ': ' . $this->smtp->getError()['error']);
            }
        }

        // DATA
        if (!$this->smtp->data()) {
            $this->smtp->close();
            throw new Exception('DATA command rejected: ' . $this->smtp->getError()['error']);
        }

        // Build Headers and MIME Body
        $mime = $this->createMimeMessage();
        if (!$this->smtp->dataSend($mime)) {
            $lastError = $this->smtp->getError()['error'] ?: $this->smtp->getLastReply();
            $this->smtp->close();
            throw new Exception('SMTP data delivery rejected: ' . $lastError);
        }

        $this->smtp->quit();
        return true;
    }

    protected function createMimeMessage()
    {
        $boundary = 'b1_dbd_' . md5(uniqid((string)time(), true));
        $date = date('r');
        $subject = str_replace(["\r", "\n"], '', $this->Subject);
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $fromName = str_replace(["\r", "\n"], '', $this->FromName);
        $encodedFrom = !empty($fromName) ? '=?UTF-8?B?' . base64_encode($fromName) . '?= <' . $this->From . '>' : '<' . $this->From . '>';

        $toHeaders = [];
        foreach ($this->to as $t) {
            $toName = str_replace(["\r", "\n"], '', $t[1]);
            $toHeaders[] = !empty($toName) ? '=?UTF-8?B?' . base64_encode($toName) . '?= <' . $t[0] . '>' : '<' . $t[0] . '>';
        }

        $headers = [
            'Date: ' . $date,
            'From: ' . $encodedFrom,
            'To: ' . implode(', ', $toHeaders),
            'Subject: ' . $encodedSubject,
            'MIME-Version: 1.0',
            'X-Mailer: PHPMailer ' . SMTP::VERSION . ' (https://github.com/PHPMailer/PHPMailer)'
        ];

        if (!empty($this->ReplyTo)) {
            $replyHeaders = [];
            foreach ($this->ReplyTo as $r) {
                $rName = str_replace(["\r", "\n"], '', $r[1]);
                $replyHeaders[] = !empty($rName) ? '=?UTF-8?B?' . base64_encode($rName) . '?= <' . $r[0] . '>' : '<' . $r[0] . '>';
            }
            $headers[] = 'Reply-To: ' . implode(', ', $replyHeaders);
        }

        if (!empty($this->AltBody)) {
            $headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';
            $body = "--{$boundary}\r\n";
            $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= chunk_split(base64_encode($this->AltBody)) . "\r\n";

            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: text/html; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= chunk_split(base64_encode($this->Body)) . "\r\n";

            $body .= "--{$boundary}--\r\n";
        } else {
            $headers[] = 'Content-Type: ' . $this->ContentType . '; charset=UTF-8';
            $headers[] = 'Content-Transfer-Encoding: base64';
            $body = chunk_split(base64_encode($this->Body));
        }

        return implode("\r\n", $headers) . "\r\n\r\n" . $body;
    }

    protected function setError($msg)
    {
        $this->error_count++;
        $this->ErrorInfo = $msg;
    }

    public function getErrorInfo()
    {
        return $this->ErrorInfo;
    }
}
