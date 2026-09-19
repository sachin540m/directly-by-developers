<?php
/**
 * PHPMailer - PHP email creation and transport class.
 * PHP Version 5.5+
 * @package PHPMailer
 * @license http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License
 */

namespace PHPMailer\PHPMailer;

/**
 * PHPMailer exception handler.
 */
class Exception extends \Exception
{
    /**
     * Prettify error message output.
     * @return string
     */
    public function errorMessage(): string
    {
        return '<strong>' . htmlspecialchars($this->getMessage(), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</strong><br />\n";
    }
}
