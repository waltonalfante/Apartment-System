<?php

namespace App\Jobs;

use App\Mail\TwoFactorCode;
use App\Services\EmailLogService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class SendOtpVerificationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 60;

    public function __construct(
        public int $userId,
        public string $recipient,
        public string $code,
        public string $subject,
        public string $heading,
        public string $purpose,
        public int $otpId,
    ) {
        $this->onQueue('default');
    }

    public function handle(EmailLogService $emailLogService): void
    {
        try {
            $fromName = config('mail.from.name', 'The Sammie\'s Apartment');
            $fromAddress = config('mail.from.address', env('MAIL_FROM_ADDRESS'));

            $payload = [
                'from' => sprintf('%s <%s>', $fromName, $fromAddress),
                'to' => [$this->recipient],
                'subject' => $this->subject,
                'html' => sprintf('<p>Your verification code: <strong>%s</strong></p>', $this->code),
                'text' => sprintf('Your verification code: %s', $this->code),
            ];

            $response = Http::withToken(env('RESEND_API_KEY'))
                ->post('https://api.resend.com/emails', $payload);

            if ($response->successful()) {
                $emailLogService->sent($this->userId, $this->recipient, $this->subject, 'otp', [
                    'purpose' => $this->purpose,
                    'otp_id' => $this->otpId,
                ]);
            } else {
                $body = (string) $response->body();
                $emailLogService->failed($this->userId, $this->recipient, $this->subject, 'otp', $body, [
                    'purpose' => $this->purpose,
                    'otp_id' => $this->otpId,
                ]);

                Log::error('Resend API error when sending OTP.', [
                    'user_id' => $this->userId,
                    'email' => $this->recipient,
                    'response' => $body,
                ]);

                throw new \RuntimeException('Resend API error: ' . $body);
            }
        } catch (\Throwable $exception) {
            $emailLogService->failed($this->userId, $this->recipient, $this->subject, 'otp', $exception->getMessage(), [
                'purpose' => $this->purpose,
                'otp_id' => $this->otpId,
            ]);

            Log::error('OTP email job failed.', [
                'user_id' => $this->userId,
                'email' => $this->recipient,
                'exception' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('OTP email job failed after retries.', [
            'user_id' => $this->userId,
            'email' => $this->recipient,
            'subject' => $this->subject,
            'exception' => $exception->getMessage(),
        ]);
    }
}