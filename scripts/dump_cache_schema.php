<?php
$db = new PDO('sqlite:'.__DIR__.'/../database/database.sqlite');
$rows = $db->query("PRAGMA table_info('cache')")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) {
    echo $r['cid'] . ' | ' . $r['name'] . ' | ' . $r['type'] . PHP_EOL;
}
