<?php
/**
 * Directly By Developers - Standardized JSON Response Utility
 */

declare(strict_types=1);

if (!defined('DBD_APP_INIT')) {
    http_response_code(403);
    exit('Direct access not permitted.');
}

class DBDResponse
{
    /**
     * Send a standardized JSON success response.
     */
    public static function success(string $message = 'Success', array $data = [], int $statusCode = 200): void
    {
        self::send([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $statusCode);
    }

    /**
     * Send a standardized JSON error response.
     */
    public static function error(string $message = 'An error occurred', array $errors = [], int $statusCode = 400): void
    {
        self::send([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $statusCode);
    }

    /**
     * Internal method to output JSON and terminate execution safely.
     */
    private static function send(array $payload, int $statusCode): void
    {
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');

        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
