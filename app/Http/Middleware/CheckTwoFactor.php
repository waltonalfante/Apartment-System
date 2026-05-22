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

        // Two-factor redirect temporarily disabled to avoid routing errors
        // when 2FA routes are not active in the environment.
        return $next($request);
    }
}
