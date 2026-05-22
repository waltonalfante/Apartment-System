<?php
$db = new PDO('sqlite:'.__DIR__.'/../database/database.sqlite');
$rows = $db->query("SELECT id, key, value, expiration FROM cache ORDER BY id DESC LIMIT 50")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) {
    echo $r['id'] . ' | ' . $r['key'] . ' | ' . $r['expiration'] . PHP_EOL;
}
