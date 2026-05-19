<?php

namespace App\Services;

use App\Models\EmailLog;

class EmailLogService
{
    public function record(array $data): EmailLog
    {
        return EmailLog::create($data);
    }

    public function sent(?int $userId, string $recipient, string $subject, string $type, array $payload = [], ?string $mailer = null): EmailLog
    {
        return $this->record([
            'user_id' => $userId,
            'recipient' => $recipient,
            'subject' => $subject,
            'type' => $type,
            'mailer' => $mailer,
            'status' => 'sent',
            'payload' => $payload,
            'sent_at' => now(),
        ]);
    }

    public function failed(?int $userId, string $recipient, string $subject, string $type, string $errorMessage, array $payload = [], ?string $mailer = null): EmailLog
    {
        return $this->record([
            'user_id' => $userId,
            'recipient' => $recipient,
            'subject' => $subject,
            'type' => $type,
            'mailer' => $mailer,
            'status' => 'failed',
            'payload' => $payload,
            'error_message' => $errorMessage,
        ]);
    }

    public function queued(?int $userId, string $recipient, string $subject, string $type, array $payload = [], ?string $mailer = null): EmailLog
    {
        return $this->record([
            'user_id' => $userId,
            'recipient' => $recipient,
            'subject' => $subject,
            'type' => $type,
            'mailer' => $mailer,
            'status' => 'queued',
            'payload' => $payload,
        ]);
    }
}