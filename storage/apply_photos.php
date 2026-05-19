<?php
$dbPath = __DIR__ . '/../database/database.sqlite';
$db = new SQLite3($dbPath);
$photoDir = __DIR__ . '/../public/images/photos';
$files = [];
if (is_dir($photoDir)) {
    foreach (glob($photoDir.'/*.*') as $f) {
        $files[] = basename($f);
    }
}
if (count($files) === 0) {
    echo "No photos found in $photoDir\n";
    exit(1);
}
$res = $db->query('SELECT id FROM rooms ORDER BY CAST(REPLACE(number, "Room ", "") AS INTEGER)');
$idx = 0;
while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    $groupIndex = (int) floor($idx / 15);
    $photoIndex = $groupIndex % count($files);
    $photo = 'images/photos/' . $files[$photoIndex];
    $stmt = $db->prepare('UPDATE rooms SET photo_path = :photo WHERE id = :id');
    $stmt->bindValue(':photo', $photo, SQLITE3_TEXT);
    $stmt->bindValue(':id', $row['id'], SQLITE3_INTEGER);
    $stmt->execute();
    $idx++;
}
echo "Applied photos to $idx rooms\n";
