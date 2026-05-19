<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ResendMailer
{
    /**
     * Send an HTML email via Resend API.
     * Returns true on success, false on failure.
     */
    public static function sendHtml(
        string $toEmail,
        string $toName,
        string $subject,
        string $html,
        ?string $replyToEmail = null,
    ): bool
    {
        $apiKey = env('RESEND_API_KEY');

        if (empty($apiKey)) {
            Log::warning('Resend API key not configured.');
            return false;
        }

        try {
            $fromAddress = env('RESEND_FROM') ?: 'onboarding@resend.dev';

            $payload = [
                'from' => $fromAddress,
                'to' => $toEmail,
                'subject' => $subject,
                'html' => $html,
            ];

            if ($replyToEmail) {
                $payload['reply_to'] = $replyToEmail;
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.resend.com/emails', $payload);

            if ($response->successful()) {
                return true;
            }

            Log::error('Resend send failed', ['status' => $response->status(), 'body' => $response->body()]);
            return false;
        } catch (\Throwable $e) {
            Log::error('Resend exception', ['exception' => $e->getMessage()]);
            return false;
        }
    }
}
