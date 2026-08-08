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
        // 2FA disabled: direct redirect to home/dashboard after registration
        return redirect()->intended(config('fortify.home'));
    }
}