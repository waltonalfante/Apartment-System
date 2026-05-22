<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTwoFactor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip 2FA check for 2FA routes and API calls
        if ($request->is('auth/2fa*') || $request->is('api/*')) {
            return $next($request);
        }

        // If the user currently has a pending login code, redirect to 2FA verification.
        if ($request->user() && $request->user()->login_code) {
            return redirect()->route('auth.2fa-verify');
        }

        return $next($request);
    }
}
