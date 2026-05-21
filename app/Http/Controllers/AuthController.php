<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\OtpService;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Send 2FA code after successful login
     */
    public function sendTwoFactorCode(Request $request, OtpService $otpService)
    {
        $user = Auth::user();

        \Log::info('AuthController::sendTwoFactorCode called', ['user_id' => $user?->id ?? null]);

        if (!$user) {
            throw ValidationException::withMessages([
                'auth' => ['Not authenticated'],
            ]);
        }

        // Manual 2FA sending is disabled for now.
        // Keep this block commented for future re-enable work.
        // try {
        //     $otpService->issue($user, 'login', ['source' => 'manual-send'], 'Your Apartment Verification Code', 'Verification Code');
        //     \Log::info('AuthController: 2FA email sent', ['user_id' => $user->id, 'email' => $user->email]);
        // } catch (\Exception $e) {
        //     \Log::error('2FA email failed: ' . $e->getMessage());
        //     return response()->json(['error' => 'Failed to send code'], 500);
        // }

        return response()->json([
            'message' => 'Two-factor authentication is disabled.',
            'email' => $user->email,
        ]);
    }

    /**
     * Verify 2FA code
     */
    public function verifyTwoFactorCode(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        $user = Auth::user();

        if (!$user) {
            throw ValidationException::withMessages([
                'auth' => ['Not authenticated'],
            ]);
        }

        return response()->json([
            'message' => 'Two-factor authentication is disabled.',
            'redirect' => route('dashboard'),
        ]);
    }
}
