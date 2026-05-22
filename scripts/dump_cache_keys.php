<?php
$db = new PDO('sqlite:'.__DIR__.'/../database/database.sqlite');
$rows = $db->query("SELECT key, length(value) as valuelen, expiration FROM cache ORDER BY rowid DESC LIMIT 100")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) {
    echo $r['key'] . ' | ' . $r['valuelen'] . ' | ' . $r['expiration'] . PHP_EOL;
}
