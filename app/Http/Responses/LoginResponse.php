<?php

namespace App\Http\Responses;

use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Build the login response.
     */
    public function toResponse($request): RedirectResponse
    {
        $user = $request->user();
        $verificationSent = false;

        \Log::info('LoginResponse triggered', ['user_id' => $user?->id ?? null, 'email' => $user?->email ?? null]);

        if ($user) {
            try {
                app(OtpService::class)->issue($user, 'login', ['source' => 'web-login'], 'Your Apartment Verification Code', 'Verification Code');
                $verificationSent = true;
                    \Log::info('LoginResponse: verification code queued', ['user_id' => $user->id, 'method' => 'queue']);
            } catch (\Throwable $exception) {
                Log::error('Failed to send login verification code.', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'exception' => $exception->getMessage(),
                ]);
            }
        }

        return redirect()->route('auth.2fa-verify')->with(
            'status',
            $verificationSent
                    ? 'We queued a verification code email to your inbox.'
                    : 'You are logged in, but the verification email could not be queued. Check the mail configuration.'
        );
    }
}
