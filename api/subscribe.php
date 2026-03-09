<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$email = isset($data['email']) ? trim($data['email']) : '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please enter a valid email address.']);
    exit;
}

// Persist to CSV (swap for DB insert as needed)
$file = __DIR__ . '/subscribers.csv';
$exists = file_exists($file);
$fp = fopen($file, 'a');

if ($fp === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not save subscription. Please try again.']);
    exit;
}

// Write header row on first run
if (!$exists) {
    fputcsv($fp, ['email', 'subscribed_at']);
}

fputcsv($fp, [$email, date('Y-m-d H:i:s')]);
fclose($fp);

echo json_encode(['success' => true, 'message' => 'Subscribed successfully.']);
