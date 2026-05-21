<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Build the login response.
     */
    public function toResponse($request): RedirectResponse
    {
        // 2FA login flow is disabled for now.
        // Keep this block commented for future re-enable work.
        // $user = $request->user();
        // if ($user) {
        //     app(OtpService::class)->issue($user, 'login', ['source' => 'web-login'], 'Your Apartment Verification Code', 'Verification Code');
        // }

        return redirect()->route('dashboard');
    }
}
