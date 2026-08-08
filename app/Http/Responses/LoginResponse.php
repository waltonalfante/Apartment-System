<?php

namespace App\Http\Responses;

<<<<<<< HEAD
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
=======
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use App\Services\OtpService;
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db

class LoginResponse implements LoginResponseContract
{
    /**
     * Build the login response.
     */
    public function toResponse($request): RedirectResponse
    {
<<<<<<< HEAD
        $user = $request->user();
        // 2FA disabled: simply redirect authenticated users to the home/dashboard.
        \Log::info('LoginResponse triggered (2FA disabled)', ['user_id' => $user?->id ?? null, 'email' => $user?->email ?? null]);

        return redirect()->intended(config('fortify.home'));
=======
        // Two-factor issuance temporarily disabled to avoid production failures.
        return redirect()->route('dashboard');
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
    }
}
