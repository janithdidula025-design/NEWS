<?php
$host = 'localhost';
$dbname = 'lankanews_db';
$username = 'root';
$password = ''; // XAMPP Default Password එක හිස්ය. Live Server එකේදී මෙය වෙනස් කරන්න.

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("Database Connection Failure: " . $e->getMessage());
}
?>
