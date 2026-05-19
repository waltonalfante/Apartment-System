<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

/** @var \App\Services\OtpService $otpService */
$otpService = $app->make(App\Services\OtpService::class);

try {
    [$otp, $code] = $otpService->issueForEmail('waltonalfante4@gmail.com', 'login');
    echo "OTP sent, code: {$code}\n";
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
