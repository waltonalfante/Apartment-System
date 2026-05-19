<?php
$path = __DIR__ . '/../database/database.sqlite';
if (!file_exists($path)) {
    echo "DB file missing: $path\n";
    exit(1);
}
try {
    $pdo = new PDO('sqlite:' . $path);
    $rows = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($rows as $r) {
        echo $r . PHP_EOL;
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
}
