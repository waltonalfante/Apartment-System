<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Foundation\Console\Kernel::class);
$kernel->bootstrap();
$rooms = App\Models\Room::select(['id','number','photo_path'])->orderBy('id')->get()->toArray();
echo json_encode($rooms, JSON_PRETTY_PRINT);
