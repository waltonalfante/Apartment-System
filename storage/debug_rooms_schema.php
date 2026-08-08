<?php
$dbPath = __DIR__ . '/../database/database.sqlite';
$db = new SQLite3($dbPath);
$res = $db->query("PRAGMA table_info('rooms')");
while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    echo $row['cid'] . '|' . $row['name'] . '|' . $row['type'] . '|' . $row['notnull'] . '|' . $row['dflt_value'] . "\n";
}
