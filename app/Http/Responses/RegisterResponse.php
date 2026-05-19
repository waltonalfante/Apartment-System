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
        return redirect()->route('auth.2fa-verify')->with(
            'status',
            'We sent a verification code to your email.'
        );
    }
}