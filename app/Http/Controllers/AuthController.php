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

        try {
            $otpService->issue($user, 'login', ['source' => 'manual-send'], 'Your Apartment Verification Code', 'Verification Code');
            \Log::info('AuthController: 2FA email sent', ['user_id' => $user->id, 'email' => $user->email]);
<<<<<<< HEAD
        } catch (\Exception $e) {
=======
        } catch (\Throwable $e) {
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
            \Log::error('2FA email failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send code'], 500);
        }

        return response()->json([
<<<<<<< HEAD
            'message' => 'Verification code sent to your email',
=======
            'message' => 'Two-factor code sent.',
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
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

<<<<<<< HEAD
        // Check if code exists and not expired
        if (!$user->login_code || $user->login_code_expires_at < now()) {
            throw ValidationException::withMessages([
                'code' => ['Code expired or not found. Please login again.'],
            ]);
        }

        // Verify code
        if ($user->login_code !== $request->code) {
            throw ValidationException::withMessages([
                'code' => ['Invalid code. Please try again.'],
            ]);
        }

        // Clear code and mark as verified
        $user->update([
            'login_code' => null,
            'login_code_expires_at' => null,
        ]);

        return response()->json([
            'message' => 'Verified successfully',
=======
        $verified = app(OtpService::class)->verify($user, 'login', $request->input('code'));

        if (! $verified) {
            return response()->json(['error' => 'Invalid code'], 422);
        }

        return response()->json([
            'message' => 'Two-factor verified.',
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
            'redirect' => route('dashboard'),
        ]);
    }
}
