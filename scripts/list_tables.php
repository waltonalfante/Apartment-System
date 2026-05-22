<?php
$db = new PDO('sqlite:'.__DIR__.'/../database/database.sqlite');
$rows = $db->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) {
    echo $r['name'] . PHP_EOL;
}
