<?php
/**
 * Directly By Developers - Hostinger SMTP Mailer Engine (PHPMailer Powered)
 */

declare(strict_types=1);

if (!defined('DBD_APP_INIT')) {
    http_response_code(403);
    exit('Direct access not permitted.');
}

// 1. Load PHPMailer library (Composer autoload if available, otherwise bundled library)
$composerAutoload = dirname(__DIR__) . '/vendor/autoload.php';
if (file_exists($composerAutoload)) {
    require_once $composerAutoload;
}

if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    require_once __DIR__ . '/PHPMailer/Exception.php';
    require_once __DIR__ . '/PHPMailer/SMTP.php';
    require_once __DIR__ . '/PHPMailer/PHPMailer.php';
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class DBDMailer
{
    /**
     * Dispatch lead notification email via Hostinger SMTP using PHPMailer.
     *
     * @param array $config Application configuration
     * @param array $lead Sanitized lead details
     * @return array [ 'success' => bool, 'error' => string|null ]
     */
    public static function sendLeadEmail(array $config, array $lead): array
    {
        $smtp = $config['smtp'] ?? [];
        $subject = self::buildEmailSubject($lead);
        $htmlBody = self::buildHtmlEmail($lead, $config);
        $plainBody = self::buildPlainTextEmail($lead);

        try {
            $mail = new PHPMailer(true);

            // Server configuration
            $mail->isSMTP();
            $mail->Host       = $smtp['host'] ?? 'smtp.hostinger.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = $smtp['username'] ?? '';
            $mail->Password   = $smtp['password'] ?? '';

            // Encryption & Port configuration
            $encryption = strtolower((string)($smtp['encryption'] ?? 'ssl'));
            if ($encryption === 'tls') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = (int)($smtp['port'] ?? 587);
            } else {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                $mail->Port       = (int)($smtp['port'] ?? 465);
            }

            // Connection options & timeouts
            $mail->Timeout     = (int)($smtp['timeout'] ?? 15);
            $mail->SMTPDebug   = 0; // Production mode: Debug off to prevent leakage
            $mail->CharSet     = PHPMailer::CHARSET_UTF8;
            $mail->Encoding    = PHPMailer::ENCODING_BASE64;

            // Sender & Recipient addresses
            $fromEmail = $smtp['from_email'] ?? 'connect@directlybydevelopers.com';
            $fromName  = $smtp['from_name'] ?? 'Directly By Developers Lead Desk';
            $toEmail   = $smtp['to_email'] ?? 'connect@directlybydevelopers.com';

            $mail->setFrom($fromEmail, $fromName);
            $mail->addAddress($toEmail);

            // Strict Reply-To handling: only use visitor email if validated
            if (!empty($lead['email']) && PHPMailer::validateAddress($lead['email'])) {
                $mail->addReplyTo($lead['email'], $lead['name'] ?? '');
            }

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlBody;
            $mail->AltBody = $plainBody;

            $mail->send();

            return ['success' => true, 'error' => null];

        } catch (Exception $e) {
            self::logError($config, 'PHPMailer Exception: ' . $e->getMessage());
            return [
                'success' => false,
                'error'   => 'Mail dispatch encountered a server error.',
            ];
        } catch (\Throwable $t) {
            self::logError($config, 'General Mailer Exception: ' . $t->getMessage());
            return [
                'success' => false,
                'error'   => 'Mail service is temporarily unavailable.',
            ];
        }
    }

    /**
     * Format a clean, descriptive email subject line.
     */
    private static function buildEmailSubject(array $lead): string
    {
        $formType = !empty($lead['formType']) ? $lead['formType'] : 'Website Lead';
        $name = !empty($lead['name']) ? $lead['name'] : 'Customer';
        $location = !empty($lead['propertyName']) ? $lead['propertyName'] : (!empty($lead['region']) ? $lead['region'] : '');

        if (!empty($location)) {
            return "New Lead: {$name} - {$location} ({$formType})";
        }

        return "New Lead: {$name} ({$formType})";
    }

    /**
     * Build responsive HTML email template with strict entity escaping.
     */
    private static function buildHtmlEmail(array $lead, array $config): string
    {
        $appName = htmlspecialchars($config['app']['name'] ?? 'Directly By Developers', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $name = htmlspecialchars($lead['name'] ?? 'N/A', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $phone = htmlspecialchars($lead['phone'] ?? 'N/A', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $email = !empty($lead['email']) ? htmlspecialchars($lead['email'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : 'Not Provided';
        $formType = htmlspecialchars($lead['formType'] ?? 'Website Enquiry', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $propertyName = !empty($lead['propertyName']) ? htmlspecialchars($lead['propertyName'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : null;
        $region = !empty($lead['region']) ? htmlspecialchars($lead['region'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : null;
        $visitDay = !empty($lead['visitDay']) ? htmlspecialchars($lead['visitDay'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : null;
        $message = !empty($lead['message']) ? nl2br(htmlspecialchars($lead['message'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')) : 'No additional message provided.';
        $submittedAt = htmlspecialchars($lead['submittedAt'] ?? date('Y-m-d H:i:s T'), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $currentUrl = !empty($lead['currentUrl']) ? htmlspecialchars($lead['currentUrl'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : 'Direct Access';
        $clientIp = htmlspecialchars($lead['clientIp'] ?? 'Unknown', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        $rowsHtml = '';
        $addRow = function (string $label, string $value) use (&$rowsHtml) {
            $rowsHtml .= "
                <tr>
                    <td style=\"padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-size: 13px; font-weight: 600; color: #475569; width: 32%; background-color: #F8FAFC;\">
                        {$label}
                    </td>
                    <td style=\"padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #1E293B;\">
                        {$value}
                    </td>
                </tr>
            ";
        };

        $addRow('Full Name', "<strong style=\"color: #0F172A; font-size: 15px;\">{$name}</strong>");
        $addRow('Phone Number', "<a href=\"tel:{$phone}\" style=\"color: #0F5132; text-decoration: none; font-weight: bold;\">{$phone}</a>");
        $addRow('Email Address', $email !== 'Not Provided' ? "<a href=\"mailto:{$email}\" style=\"color: #2563EB; text-decoration: none;\">{$email}</a>" : $email);
        $addRow('Enquiry Type', "<span style=\"background-color: #DEF7EC; color: #03543F; font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 4px;\">{$formType}</span>");

        if ($propertyName) {
            $addRow('Property Name', "<strong style=\"color: #1A365D;\">{$propertyName}</strong>");
        }
        if ($region) {
            $addRow('Region / Location', "<strong>{$region}</strong>");
        }
        if ($visitDay) {
            $addRow('Preferred Visit Day', "<span style=\"color: #C05621; font-weight: 600;\">{$visitDay}</span>");
        }
        $addRow('Message / Notes', "<div style=\"background-color: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid #E2E8F0; color: #334155; line-height: 1.6;\">{$message}</div>");

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Website Lead</title>
</head>
<body style="margin: 0; padding: 24px 10px; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border: 1px solid #E2E8F0;">
        <tr>
            <td style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); padding: 24px 28px; text-align: left; border-bottom: 3px solid #C5A86D;">
                <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">
                    {$appName}
                </h1>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #94A3B8;">
                    New Verified Lead Submission Notification
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #F0FDF4; border-bottom: 1px solid #DCFCE7; padding: 12px 28px;">
                <p style="margin: 0; font-size: 13px; color: #166534; font-weight: 600;">
                    Action Required: A new visitor requested direct developer contact.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 24px 28px;">
                <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
                    {$rowsHtml}
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding: 16px 28px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0;">
                <h4 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #64748B; letter-spacing: 0.5px;">
                    Submission Metadata
                </h4>
                <p style="margin: 3px 0; font-size: 11px; color: #64748B;">
                    <strong>Timestamp:</strong> {$submittedAt}
                </p>
                <p style="margin: 3px 0; font-size: 11px; color: #64748B;">
                    <strong>Page URL:</strong> <a href="{$currentUrl}" style="color: #64748B; word-break: break-all;">{$currentUrl}</a>
                </p>
                <p style="margin: 3px 0; font-size: 11px; color: #64748B;">
                    <strong>Client IP:</strong> {$clientIp}
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #0F172A; padding: 16px 28px; text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                    This automated email was sent by the Hostinger SMTP lead engine of Directly By Developers.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }

    /**
     * Build plain-text fallback email.
     */
    private static function buildPlainTextEmail(array $lead): string
    {
        $name = $lead['name'] ?? 'N/A';
        $phone = $lead['phone'] ?? 'N/A';
        $email = $lead['email'] ?? 'Not Provided';
        $formType = $lead['formType'] ?? 'Website Enquiry';
        $propertyName = $lead['propertyName'] ?? 'N/A';
        $region = $lead['region'] ?? 'N/A';
        $visitDay = $lead['visitDay'] ?? 'N/A';
        $message = $lead['message'] ?? 'N/A';
        $submittedAt = $lead['submittedAt'] ?? date('Y-m-d H:i:s T');
        $currentUrl = $lead['currentUrl'] ?? 'N/A';
        $clientIp = $lead['clientIp'] ?? 'Unknown';

        return <<<TEXT
NEW LEAD NOTIFICATION - DIRECTLY BY DEVELOPERS
==================================================

Full Name:       {$name}
Phone Number:    {$phone}
Email Address:   {$email}
Enquiry Type:    {$formType}
Property:        {$propertyName}
Region:          {$region}
Preferred Day:   {$visitDay}
Message / Notes: {$message}

SUBMISSION METADATA:
--------------------------------------------------
Timestamp:       {$submittedAt}
Page Source URL: {$currentUrl}
Client IP:       {$clientIp}

==================================================
Directly By Developers Automated Lead Notification
TEXT;
    }

    /**
     * Log technical errors safely without exposing SMTP passwords.
     */
    private static function logError(array $config, string $message): void
    {
        $logConfig = $config['logging'] ?? [];
        if (empty($logConfig['enabled'])) {
            return;
        }

        $logFile = $logConfig['log_file'] ?? (dirname(__DIR__) . '/logs/submissions.log');
        $date = date('Y-m-d H:i:s T');
        $entry = "[{$date}] [ERROR] {$message}\n";

        @file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);
    }
}
