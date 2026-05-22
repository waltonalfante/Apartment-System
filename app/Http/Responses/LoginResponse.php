<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use App\Services\OtpService;

class LoginResponse implements LoginResponseContract
{
    /**
     * Build the login response.
     */
    public function toResponse($request): RedirectResponse
    {
        // Enable 2FA login flow: issue a login OTP after successful login
        $user = $request->user();
        if ($user) {
            try {
                app(OtpService::class)->issue($user, 'login', ['source' => 'web-login'], 'Your Apartment Verification Code', 'Verification Code');
            } catch (\Throwable $e) {
                // Log and continue to avoid blocking login if email queueing fails
                \Log::error('Failed to issue 2FA code on login: '.$e->getMessage(), ['user_id' => $user->id]);
            }
        }

        return redirect()->route('dashboard');
    }
}
