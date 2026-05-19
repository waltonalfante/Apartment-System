<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OtpController extends Controller
{
    public function __construct(private readonly OtpService $otpService)
    {
    }

    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'purpose' => ['required', 'string', 'max:50'],
        ]);

        $this->ensureWithinLimit($request, $data['email']);

        $user = User::query()->where('email', $data['email'])->firstOrFail();
        [, $code] = $this->otpService->issue($user, $data['purpose']);

        return response()->json([
            'message' => 'OTP sent successfully.',
            'code' => app()->isLocal() ? $code : null,
        ]);
    }

    public function verify(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'purpose' => ['required', 'string', 'max:50'],
            'code' => ['required', 'digits:6'],
        ]);

        $user = User::query()->where('email', $data['email'])->firstOrFail();

        if (! $this->otpService->verify($user, $data['purpose'], $data['code'])) {
            throw ValidationException::withMessages([
                'code' => ['Invalid or expired code.'],
            ]);
        }

        return response()->json([
            'message' => 'OTP verified successfully.',
        ]);
    }

    public function resend(Request $request): JsonResponse
    {
        return $this->send($request);
    }

    private function ensureWithinLimit(Request $request, string $email): void
    {
        $key = Str::lower($email).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages([
                'email' => ['Too many OTP requests. Please try again later.'],
            ]);
        }

        RateLimiter::hit($key, 60);
    }
}