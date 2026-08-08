<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * Build the registration response.
     */
    public function toResponse($request): RedirectResponse
    {
<<<<<<< HEAD
        // 2FA disabled: direct redirect to home/dashboard after registration
        return redirect()->intended(config('fortify.home'));
=======
        // Registration 2FA flow is disabled for now.
        // Keep this redirect commented for future re-enable work.
        // return redirect()->route('auth.2fa-verify')->with('status', 'We sent a verification code to your email.');

        return redirect()->route('dashboard');
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
    }
}