<?php

namespace App\Services;

use App\Mail\TwoFactorCode;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Throwable;

class OtpService
{
    public function __construct(private readonly EmailLogService $emailLogService)
    {
    }

    public function issue(User $user, string $purpose, array $meta = [], ?string $subject = null, ?string $heading = null): array
    {
        $this->invalidatePendingCodes($user, $purpose);

        $plainCode = $this->generateCode();
        $subjectBase = $subject ?? 'Your Apartment Verification Code';
        $subjectLine = sprintf('%s: %s', $subjectBase, $plainCode);
        $headingLine = $heading ?? 'Verification Code';

        $otp = OtpCode::create([
            'user_id' => $user->id,
            'purpose' => $purpose,
            'sent_to' => $user->email,
            'code_hash' => Hash::make($plainCode),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(10),
            'meta' => array_merge($meta, [
                'subject' => $subjectLine,
                'heading' => $headingLine,
            ]),
        ]);

        $user->forceFill([
            'login_code' => $plainCode,
            'login_code_expires_at' => now()->addMinutes(10),
        ])->save();

        try {
            Mail::to($user->email)->send(new TwoFactorCode($plainCode, $subjectLine, $headingLine));

            $this->emailLogService->sent($user->id, $user->email, $subjectLine, 'otp', [
                'purpose' => $purpose,
                'otp_id' => $otp->id,
            ]);
        } catch (Throwable $exception) {
            $this->emailLogService->failed($user->id, $user->email, $subjectLine, 'otp', $exception->getMessage(), [
                'purpose' => $purpose,
                'otp_id' => $otp->id,
            ]);

            throw $exception;
        }

        return [$otp, $plainCode];
    }

    public function resend(User $user, string $purpose, array $meta = [], ?string $subject = null, ?string $heading = null): array
    {
        return $this->issue($user, $purpose, $meta, $subject, $heading);
    }

    public function latestPending(User $user, string $purpose): ?OtpCode
    {
        return OtpCode::query()
            ->where('user_id', $user->id)
            ->where('purpose', $purpose)
            ->pending()
            ->latest()
            ->first();
    }

    public function verify(User $user, string $purpose, string $code): bool
    {
        $otp = $this->latestPending($user, $purpose);

        if (! $otp) {
            return false;
        }

        if (! Hash::check($code, $otp->code_hash)) {
            $otp->increment('attempts');

            return false;
        }

        $otp->forceFill(['verified_at' => now()])->save();

        $user->forceFill([
            'login_code' => null,
            'login_code_expires_at' => null,
        ])->save();

        return true;
    }

    public function invalidatePendingCodes(User $user, string $purpose): void
    {
        OtpCode::query()
            ->where('user_id', $user->id)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->update([
                'expires_at' => now()->subMinute(),
            ]);
    }

    protected function generateCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    public function issueForEmail(string $email, string $purpose, array $meta = [], ?string $subject = null, ?string $heading = null): array
    {
        $user = User::query()->where('email', $email)->firstOrFail();

        return $this->issue($user, $purpose, $meta, $subject, $heading);
    }

    public function verifyForEmail(string $email, string $purpose, string $code): bool
    {
        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            return false;
        }

        return $this->verify($user, $purpose, $code);
    }
}