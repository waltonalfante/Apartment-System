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
        // Two-factor issuance temporarily disabled to avoid production failures.
        return redirect()->route('dashboard');
    }
}
