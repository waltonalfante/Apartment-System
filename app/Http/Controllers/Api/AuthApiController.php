<?php

namespace App\Http\Controllers\Api;

use App\Actions\Fortify\CreateNewUser;
use App\Http\Controllers\Controller;
use App\Services\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthApiController extends Controller
{
    public function __construct(
        private readonly CreateNewUser $createNewUser,
        private readonly OtpService $otpService,
    ) {
    }

    public function register(Request $request): JsonResponse
    {
        $user = $this->createNewUser->create($request->all());
        $this->otpService->issue($user, 'registration', ['source' => 'api'], 'Your Apartment Verification Code', 'Verify Your Email');

        return response()->json([
            'message' => 'Account created. OTP sent to email.',
            'user' => $user,
        ], 201);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}