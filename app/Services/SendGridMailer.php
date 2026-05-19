<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class SendGridMailer
{
    /**
     * Send an HTML email via SendGrid API.
     * Returns true on success, false on failure.
     */
    public static function sendHtml(string $toEmail, string $toName, string $subject, string $html): bool
    {
        $apiKey = env('SENDGRID_API_KEY');

        if (empty($apiKey)) {
            Log::warning('SendGrid API key not configured.');
            return false;
        }

        try {
            $email = new \SendGrid\Mail\Mail();
            $fromAddress = env('MAIL_FROM_ADDRESS', 'no-reply@example.com');
            $fromName = env('MAIL_FROM_NAME', 'App');

            $email->setFrom($fromAddress, $fromName);
            $email->setSubject($subject);
            $email->addTo($toEmail, $toName ?? '');
            $email->addContent('text/html', $html);

            $sendgrid = new \SendGrid($apiKey);
            $response = $sendgrid->send($email);

            $status = $response->statusCode();
            if ($status >= 200 && $status < 300) {
                return true;
            }

            Log::error('SendGrid send failed', ['status' => $status, 'body' => $response->body()]);
            return false;
        } catch (\Throwable $e) {
            Log::error('SendGrid exception', ['exception' => $e->getMessage()]);
            return false;
        }
    }
}
