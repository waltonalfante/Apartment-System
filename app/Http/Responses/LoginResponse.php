<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Support\Facades\Log;

class LoginResponse implements LoginResponseContract
{
    /**
     * Build the login response.
     */
    public function toResponse($request): RedirectResponse
    {
        $user = $request->user();
        // 2FA disabled: simply redirect authenticated users to the home/dashboard.
        Log::info('LoginResponse triggered (2FA disabled)', ['user_id' => $user?->id ?? null, 'email' => $user?->email ?? null]);

        return redirect()->intended(config('fortify.home'));
    }
}
