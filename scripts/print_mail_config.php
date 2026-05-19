<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "MAIL_MAILER=" . config('mail.default') . PHP_EOL;
echo "MAIL_HOST=" . config('mail.mailers.'.config('mail.default').'.host') . PHP_EOL;
echo "MAIL_PORT=" . config('mail.mailers.'.config('mail.default').'.port') . PHP_EOL;
echo "MAIL_USERNAME=" . config('mail.mailers.'.config('mail.default').'.username') . PHP_EOL;
echo "MAIL_FROM_ADDRESS=" . config('mail.from.address') . PHP_EOL;

echo "DB_CONNECTION=" . config('database.default') . PHP_EOL;
echo "DB_DATABASE=" . config('database.connections.'.config('database.default').'.database') . PHP_EOL;
