<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use App\Services\OtpService;
use Illuminate\Support\Facades\Log;

class SendRegistrationTwoFactorCode
{
    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $user = $event->user;

        if (! $user) {
            return;
        }

<<<<<<< HEAD
        try {
            app(OtpService::class)->issue($user, 'registration', ['source' => 'registration'], 'Your Apartment Verification Code', 'Verify Your Email');

            Log::info('Registration 2FA code sent', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
        } catch (\Throwable $exception) {
            Log::error('Registration 2FA code failed', [
                'user_id' => $user->id,
                'email' => $user->email,
                'exception' => $exception->getMessage(),
            ]);
        }
=======
        // Registration 2FA is disabled for now.
        // Keep this block commented for future re-enable work.
        // try {
        //     app(OtpService::class)->issue($user, 'registration', ['source' => 'registration'], 'Your Apartment Verification Code', 'Verify Your Email');
        //
        //     Log::info('Registration 2FA code sent', [
        //         'user_id' => $user->id,
        //         'email' => $user->email,
        //     ]);
        // } catch (\Throwable $exception) {
        //     Log::error('Registration 2FA code failed', [
        //         'user_id' => $user->id,
        //         'email' => $user->email,
        //         'exception' => $exception->getMessage(),
        //     ]);
        // }
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
    }
}