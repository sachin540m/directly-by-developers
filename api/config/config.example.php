<?php
/**
 * Directly By Developers - SMTP & Backend Configuration (Example Template)
 *
 * Copy this file to config.php and update with your actual Hostinger SMTP credentials.
 * NEVER commit config.php containing real credentials to a public git repository.
 */

declare(strict_types=1);

// Prevent direct script access
if (!defined('DBD_APP_INIT')) {
    http_response_code(403);
    exit('Direct access not permitted.');
}

return [
    /**
     * Application Settings
     */
    'app' => [
        'name'        => 'Directly By Developers',
        'env'         => getenv('APP_ENV') ?: 'production',
        'timezone'    => 'Asia/Kolkata',
        'debug'       => false, // Keep false in production
    ],

    /**
     * Hostinger SMTP Server Configuration
     */
    'smtp' => [
        'host'       => getenv('SMTP_HOST') ?: 'smtp.hostinger.com',
        'port'       => (int)(getenv('SMTP_PORT') ?: 465),
        'encryption' => getenv('SMTP_ENCRYPTION') ?: 'ssl', // 'ssl' (port 465) or 'tls' (port 587)
        'username'   => getenv('SMTP_USERNAME') ?: 'connect@directlybydevelopers.com',
        'password'   => getenv('SMTP_PASSWORD') ?: 'YOUR_HOSTINGER_EMAIL_PASSWORD_HERE',
        'from_email' => getenv('SMTP_FROM_EMAIL') ?: 'connect@directlybydevelopers.com',
        'from_name'  => getenv('SMTP_FROM_NAME') ?: 'Directly By Developers Lead Desk',
        'to_email'   => getenv('SMTP_TO_EMAIL') ?: 'connect@directlybydevelopers.com',
        'timeout'    => 15,
    ],

    /**
     * Security & Anti-Abuse Configuration
     */
    'security' => [
        'allowed_origins' => [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:8000',
            'https://directlybydevelopers.com',
            'https://www.directlybydevelopers.com',
        ],
        'max_payload_bytes' => 51200, // 50KB limit
        'rate_limit' => [
            'enabled'       => true,
            'max_requests'  => 10,
            'window_seconds'=> 300,
        ],
    ],

    /**
     * Logging Configuration
     */
    'logging' => [
        'enabled'  => true,
        'log_file' => __DIR__ . '/../logs/submissions.log',
    ],
];
