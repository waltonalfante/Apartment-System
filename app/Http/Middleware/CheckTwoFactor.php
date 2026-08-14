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
	 * This is a simple pass-through stub. Replace with real two-factor
	 * enforcement logic if/when required.
	 */
	public function handle(Request $request, Closure $next): Response
	{
		return $next($request);
	}
}

