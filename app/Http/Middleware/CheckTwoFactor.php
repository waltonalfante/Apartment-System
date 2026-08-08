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
<<<<<<< HEAD
        // Temporary bypass for 2FA when diagnosing login issues.
        if (env('DISABLE_2FA', false)) {
            return $next($request);
        }

=======
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
        // Skip 2FA check for 2FA routes and API calls
        if ($request->is('auth/2fa*') || $request->is('api/*')) {
            return $next($request);
        }

<<<<<<< HEAD
        // If user is authenticated and has a pending login code, redirect to 2FA
        if ($request->user() && $request->user()->login_code) {
            return redirect()->route('auth.2fa-verify');
        }

=======
        // Two-factor redirect temporarily disabled to avoid routing errors
        // when 2FA routes are not active in the environment.
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
        return $next($request);
    }
}
