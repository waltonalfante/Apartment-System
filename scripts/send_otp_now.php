<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$email = $argv[1] ?? 'waltonalfante4@gmail.com';

$user = App\Models\User::query()->where('email', $email)->first();
if (! $user) {
    fwrite(STDOUT, "NO_USER for {$email}\n");
    exit(1);
}

$code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

$user->forceFill([
    'login_code' => $code,
    'login_code_expires_at' => now()->addMinutes(10),
])->save();

$job = new App\Jobs\SendOtpVerificationEmail(
    $user->id,
    $user->email,
    $code,
    'Your Apartment Verification Code: ' . $code,
    'Verification Code',
    'login',
    0,
);

$job->handle(app(App\Services\EmailLogService::class));

fwrite(STDOUT, "SENT CODE={$code} TO={$user->email}\n");
