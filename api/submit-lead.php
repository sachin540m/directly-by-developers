<?php
/**
 * Directly By Developers - Lead Submission API Endpoint
 *
 * Handles public form submissions, input sanitization, anti-abuse checks,
 * and delivers notification emails via Hostinger SMTP using PHPMailer.
 */

declare(strict_types=1);

// Security constant to authorize internal file includes
define('DBD_APP_INIT', true);

// Set default error handling to avoid leaking server paths or errors
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Load required backend classes
require_once __DIR__ . '/includes/response.php';
require_once __DIR__ . '/includes/security.php';
require_once __DIR__ . '/includes/mailer.php';

// Optional: check for Composer autoload if present
$composerAutoload = __DIR__ . '/vendor/autoload.php';
if (file_exists($composerAutoload)) {
    require_once $composerAutoload;
}

// Load configuration
$configFile = __DIR__ . '/config/config.php';
if (!file_exists($configFile)) {
    $configFile = __DIR__ . '/config/config.example.php';
}

if (!file_exists($configFile)) {
    DBDResponse::error('Backend configuration is missing. Please contact administrator.', [], 500);
}

$config = require $configFile;

if (!is_array($config)) {
    DBDResponse::error('Invalid configuration file format.', [], 500);
}

// 1. Handle CORS and preflight requests
DBDSecurity::handleCORS($config);

// 2. Parse and validate HTTP request method and payload size/JSON
$requestPayload = DBDSecurity::parseAndValidateRequest($config);

// 3. Honeypot check: If bot filled hidden traps, pretend success to prevent spam retry
if (DBDSecurity::isBotSubmission($requestPayload)) {
    usleep(250000); // 250ms simulated processing
    DBDResponse::success('Thank you! Your enquiry has been received.');
}

// 4. Rate limiting per IP
DBDSecurity::checkRateLimit($config);

// 5. Server-side validation and sanitization
$validationResult = DBDSecurity::validateAndSanitizeLeadData($requestPayload);
if (!$validationResult['valid']) {
    DBDResponse::error('Please correct the errors in the form.', $validationResult['errors'], 422);
}

$cleanLead = $validationResult['sanitized'];

// 6. Send email notification via Hostinger SMTP (PHPMailer)
$mailResult = DBDMailer::sendLeadEmail($config, $cleanLead);

if ($mailResult['success']) {
    DBDResponse::success('Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.', [
        'leadId'      => substr(md5(uniqid('', true)), 0, 8),
        'submittedAt' => $cleanLead['submittedAt'],
    ]);
} else {
    DBDResponse::error(
        $mailResult['error'] ?? 'Failed to deliver enquiry notification. Please try again later or contact us directly.',
        [],
        500
    );
}
