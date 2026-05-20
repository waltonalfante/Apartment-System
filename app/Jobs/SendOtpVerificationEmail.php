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
use Illuminate\Support\Facades\Mail;

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
            Mail::to($this->recipient)->send(new TwoFactorCode($this->code, $this->subject, $this->heading));

            $emailLogService->sent($this->userId, $this->recipient, $this->subject, 'otp', [
                'purpose' => $this->purpose,
                'otp_id' => $this->otpId,
            ]);
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