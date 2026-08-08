<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Http\Responses\LoginResponse;
use App\Http\Responses\RegisterResponse;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
        $this->app->singleton(\Laravel\Fortify\Contracts\LoginResponse::class, LoginResponse::class);
        $this->app->singleton(\Laravel\Fortify\Contracts\RegisterResponse::class, RegisterResponse::class);
<<<<<<< HEAD
=======

        // DB-backed account lock: replace Fortify authentication to enforce locks.
        Fortify::authenticateUsing(function (Request $request) {
            $login = $request->input(Fortify::username());
            $user = User::where('email', $login)->first();

            if (! $user) {
                return null;
            }

            if ($user->locked_until && $user->locked_until->isFuture()) {
                throw ValidationException::withMessages([
                    Fortify::username() => ["Your account is locked until {$user->locked_until->toDateTimeString()}"],
                ]);
            }

            if (Hash::check($request->password, $user->password)) {
                $user->failed_attempts = 0;
                $user->locked_until = null;
                $user->save();

                return $user;
            }

            $user->failed_attempts = ($user->failed_attempts ?? 0) + 1;
            if ($user->failed_attempts >= 5) {
                $user->locked_until = now()->addMinutes(15);
            }
            $user->save();

            return null;
        });
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('otp', function (Request $request) {
            return Limit::perMinute(5)->by(Str::lower((string) $request->input('email', $request->ip())));
        });

        RateLimiter::for('announcement', function (Request $request) {
            return Limit::perMinute(10)->by((string) ($request->user()?->id ?? $request->ip()));
        });

        RateLimiter::for('email-send', function (Request $request) {
            return Limit::perMinute(30)->by((string) ($request->user()?->id ?? $request->ip()));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            // Lock account after 5 failed attempts for 15 minutes
            return Limit::perMinutes(15, 5)->by($throttleKey);
        });
    }
}
