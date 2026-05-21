<?php
$dbPath = __DIR__ . '/../database/database.sqlite';
if (!file_exists($dbPath)) {
    echo json_encode(['error' => 'database file not found', 'path' => $dbPath]);
    exit(0);
}
try {
    $db = new PDO('sqlite:' . $dbPath);
    $stmt = $db->query('SELECT * FROM email_logs ORDER BY id DESC LIMIT 20');
    $rows = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
    echo json_encode($rows, JSON_PRETTY_PRINT);
} catch (Throwable $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
