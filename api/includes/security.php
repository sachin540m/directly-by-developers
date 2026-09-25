<?php
/**
 * Directly By Developers - Security, CORS, Sanitization & Validation Layer
 */

declare(strict_types=1);

if (!defined('DBD_APP_INIT')) {
    http_response_code(403);
    exit('Direct access not permitted.');
}

class DBDSecurity
{
    /**
     * Handle CORS headers based on configuration.
     */
    public static function handleCORS(array $config): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowedOrigins = $config['security']['allowed_origins'] ?? [];

        if (!empty($origin)) {
            $isAllowed = in_array($origin, $allowedOrigins, true) ||
                         preg_match('/^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/i', $origin);

            if ($isAllowed) {
                header("Access-Control-Allow-Origin: {$origin}");
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Max-Age: 86400');
            }
        }

        // Handle preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
                header('Access-Control-Allow-Methods: POST, OPTIONS');
            }
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            }
            http_response_code(204);
            exit;
        }
    }

    /**
     * Validate HTTP method and Content-Type.
     */
    public static function parseAndValidateRequest(array $config): array
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            DBDResponse::error('Method not allowed. Only POST requests are accepted.', [], 405);
        }

        $contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
        $maxBytes = (int)($config['security']['max_payload_bytes'] ?? 51200);

        if ($contentLength > $maxBytes) {
            DBDResponse::error('Payload size limit exceeded (maximum 50KB).', [], 413);
        }

        $rawInput = file_get_contents('php://input');
        if (empty($rawInput) && (php_sapi_name() === 'cli' || php_sapi_name() === 'cli-server')) {
            $rawInput = file_get_contents('php://stdin');
        }

        if (empty($rawInput)) {
            DBDResponse::error('Empty request payload received.', [], 400);
        }

        if (strlen($rawInput) > $maxBytes) {
            DBDResponse::error('Payload size limit exceeded.', [], 413);
        }

        $data = json_decode($rawInput, true);
        if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
            DBDResponse::error('Invalid JSON format: ' . json_last_error_msg(), [], 400);
        }

        return $data;
    }

    /**
     * Check if submission was triggered by a bot via honeypot fields.
     */
    public static function isBotSubmission(array $data): bool
    {
        $honeypotKeys = ['_gotcha', 'honeypot', 'website_url', 'company_fax', 'middle_name', 'user_age'];
        foreach ($honeypotKeys as $key) {
            if (!empty($data[$key])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check IP-based rate limiting on shared hosting.
     */
    public static function checkRateLimit(array $config): void
    {
        $rateConfig = $config['security']['rate_limit'] ?? [];
        if (empty($rateConfig['enabled'])) {
            return;
        }

        $clientIp = self::getClientIp();
        $ipHash = hash('sha256', $clientIp);
        $maxRequests = (int)($rateConfig['max_requests'] ?? 10);
        $windowSeconds = (int)($rateConfig['window_seconds'] ?? 300);

        $logDir = dirname(__DIR__) . '/logs';
        if (!is_dir($logDir) || !is_writable($logDir)) {
            $logDir = sys_get_temp_dir();
        }

        $rateFile = rtrim($logDir, '/\\') . DIRECTORY_SEPARATOR . "rate_limit_{$ipHash}.json";
        $now = time();
        $records = [];

        if (file_exists($rateFile)) {
            $content = @file_get_contents($rateFile);
            if ($content) {
                $decoded = json_decode($content, true);
                if (is_array($decoded)) {
                    $records = array_filter($decoded, function ($timestamp) use ($now, $windowSeconds) {
                        return ($now - (int)$timestamp) < $windowSeconds;
                    });
                }
            }
        }

        if (count($records) >= $maxRequests) {
            DBDResponse::error('Too many requests. Please wait a few minutes before submitting again.', [], 429);
        }

        $records[] = $now;
        @file_put_contents($rateFile, json_encode($records), LOCK_EX);
    }

    /**
     * Sanitize and validate lead submission data.
     */
    public static function validateAndSanitizeLeadData(array $input): array
    {
        $errors = [];
        $sanitized = [];

        // 1. Full Name (Required, 2-100 characters)
        $rawName = $input['name'] ?? '';
        $cleanName = self::sanitizeSingleLine($rawName, 100);
        if (empty($cleanName)) {
            $errors['name'] = 'Full name is required.';
        } elseif (mb_strlen($cleanName) < 2) {
            $errors['name'] = 'Please enter a valid name (at least 2 characters).';
        }
        $sanitized['name'] = $cleanName;

        // 2. Phone Number (Required, 7-16 digits to support international numbers)
        $rawPhone = $input['phone'] ?? '';
        $cleanPhone = preg_replace('/[^\d+]/', '', trim((string)$rawPhone));
        $digitsOnly = preg_replace('/\D/', '', $cleanPhone);

        if (empty($digitsOnly)) {
            $errors['phone'] = 'Phone number is required.';
        } elseif (strlen($digitsOnly) < 7 || strlen($digitsOnly) > 16) {
            $errors['phone'] = 'Please enter a valid phone number.';
        }
        $sanitized['phone'] = $cleanPhone;

        // 3. Email (Optional, strictly validated if provided)
        $rawEmail = trim((string)($input['email'] ?? ''));
        $cleanEmail = str_replace(["\r", "\n", "\t"], '', $rawEmail);
        if (!empty($cleanEmail)) {
            $filteredEmail = filter_var($cleanEmail, FILTER_SANITIZE_EMAIL);
            if (!filter_var($filteredEmail, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'Please provide a valid email address.';
            } else {
                $sanitized['email'] = $filteredEmail;
            }
        } else {
            $sanitized['email'] = '';
        }

        // 4. Form Type & Lead Type (Single-line sanitized)
        $sanitized['formType'] = self::sanitizeSingleLine($input['formType'] ?? 'Website Enquiry', 100);
        $sanitized['leadType'] = self::sanitizeSingleLine($input['leadType'] ?? $sanitized['formType'], 100);

        // 5. Property Name, Region & Preferred Visit Day
        $sanitized['propertyName'] = self::sanitizeSingleLine($input['propertyName'] ?? '', 150);
        $sanitized['region']       = self::sanitizeSingleLine($input['region'] ?? $input['location'] ?? '', 100);
        $sanitized['visitDay']     = self::sanitizeSingleLine($input['visitDay'] ?? '', 50);

        // 6. Message / Requirement (Multi-line sanitized)
        $sanitized['message']      = self::sanitizeMultiLine($input['message'] ?? '', 3000);

        // 7. Metadata
        $rawUrl = trim((string)($input['currentUrl'] ?? ''));
        $sanitized['currentUrl']   = filter_var($rawUrl, FILTER_SANITIZE_URL);
        $sanitized['pageSource']   = self::sanitizeSingleLine($input['pageSource'] ?? '', 100);
        $istDate = new DateTime('now', new DateTimeZone('Asia/Kolkata'));
        $sanitized['submittedAt']  = $istDate->format('Y-m-d h:i:s A \I\S\T');
        $sanitized['clientIp']     = self::getClientIp();
        $sanitized['userAgent']    = self::sanitizeSingleLine($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 255);

        return [
            'valid'     => empty($errors),
            'sanitized' => $sanitized,
            'errors'    => $errors,
        ];
    }

    /**
     * Sanitize single-line text and strip CRLF to prevent header injection.
     */
    public static function sanitizeSingleLine(mixed $value, int $maxLength = 255): string
    {
        if (!is_string($value)) {
            $value = (string)$value;
        }
        $clean = strip_tags(trim($value));
        $clean = str_replace(["\r", "\n", "\t"], ' ', $clean);
        $clean = preg_replace('/\s+/', ' ', $clean);
        return mb_substr($clean, 0, $maxLength);
    }

    /**
     * Sanitize multi-line text.
     */
    public static function sanitizeMultiLine(mixed $value, int $maxLength = 3000): string
    {
        if (!is_string($value)) {
            $value = (string)$value;
        }
        $clean = strip_tags(trim($value));
        return mb_substr($clean, 0, $maxLength);
    }

    /**
     * Safely resolve client IP address without blindly trusting spoofable headers.
     */
    public static function getClientIp(): string
    {
        $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

        // Check Cloudflare header if present and remote addr is a trusted proxy
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            $cfIp = trim($_SERVER['HTTP_CF_CONNECTING_IP']);
            if (filter_var($cfIp, FILTER_VALIDATE_IP)) {
                return $cfIp;
            }
        }

        // Check standard X-Forwarded-For if REMOTE_ADDR is private/localhost proxy
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $clientIp = trim($ips[0]);
            if (filter_var($clientIp, FILTER_VALIDATE_IP)) {
                return $clientIp;
            }
        }

        if (filter_var($remoteAddr, FILTER_VALIDATE_IP)) {
            return $remoteAddr;
        }

        return '0.0.0.0';
    }
}
