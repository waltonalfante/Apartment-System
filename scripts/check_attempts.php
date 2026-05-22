<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Http\Kernel::class)->bootstrap();

use Illuminate\Support\Str;
use Illuminate\Support\Facades\RateLimiter;

$email = $argv[1] ?? 'testestestest@gmail.com';
$ip = $argv[2] ?? '127.0.0.1';
$key = Str::transliterate(Str::lower($email).'|'.$ip);
echo "throttle key: $key\n";
echo 'attempts: ' . RateLimiter::attempts($key) . PHP_EOL;
