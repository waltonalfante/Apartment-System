<?php
$dbPath = __DIR__ . '/../database/database.sqlite';
if (!file_exists($dbPath)) {
    echo "DB file not found: $dbPath\n";
    exit(1);
}
$db = new SQLite3($dbPath);
$res = $db->query('select id, number, photo_path from rooms order by id');
while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    echo $row['id'] . '|' . $row['number'] . '|' . ($row['photo_path'] ?? '') . "\n";
}
