<?php
/**
 * Contact form endpoint — Aman Khan portfolio
 * Saves submissions to data/messages.json AND emails them to you.
 *
 * Setup on Hostinger:
 *  1. Upload this file to public_html/
 *  2. Create a writable folder: public_html/data/  (chmod 755)
 *  3. Edit $TO_EMAIL below to your address.
 *  4. Edit $ADMIN_TOKEN to a long random string (used to view inbox).
 *
 * Endpoint URL: https://yourdomain.com/submit.php
 */

// ---------- CONFIG ----------
$TO_EMAIL    = 'amankhan46473@gmail.com';
$FROM_EMAIL  = 'noreply@yourdomain.com';   // change after you buy domain
$ADMIN_TOKEN = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
$DATA_DIR    = __DIR__ . '/data';
$DATA_FILE   = $DATA_DIR . '/messages.json';
$RATE_LIMIT_PER_IP_PER_HR = 5;
// ----------------------------

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ---------- ADMIN INBOX VIEW ----------
// GET /submit.php?inbox=1&token=YOUR_TOKEN  -> dumps all messages
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['inbox'])) {
    if (!isset($_GET['token']) || !hash_equals($ADMIN_TOKEN, $_GET['token'])) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Forbidden']);
        exit;
    }
    if (!file_exists($DATA_FILE)) { echo json_encode(['ok' => true, 'messages' => []]); exit; }
    $raw = file_get_contents($DATA_FILE);
    $messages = $raw ? json_decode($raw, true) : [];
    echo json_encode(['ok' => true, 'count' => count($messages), 'messages' => array_reverse($messages)]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ---------- PARSE INPUT (JSON or form) ----------
$raw = file_get_contents('php://input');
$data = [];
if ($raw && strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $data = json_decode($raw, true) ?: [];
} else {
    $data = $_POST;
}

$name    = trim($data['name']    ?? '');
$email   = trim($data['email']   ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');
$honeypot = trim($data['website'] ?? ''); // hidden field, must be empty

// ---------- VALIDATE ----------
$errors = [];
if ($honeypot !== '')                                    $errors[] = 'spam';
if ($name === '' || mb_strlen($name) > 80)               $errors[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))          $errors[] = 'email';
if ($subject === '' || mb_strlen($subject) > 80)         $errors[] = 'subject';
if ($message === '' || mb_strlen($message) > 5000)       $errors[] = 'message';

if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid input', 'fields' => $errors]);
    exit;
}

// ---------- RATE LIMIT (file-based, per IP per hour) ----------
@mkdir($DATA_DIR, 0755, true);
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = explode(',', $ip)[0];
$rateFile = $DATA_DIR . '/rate_' . md5($ip) . '.json';
$now = time();
$hits = [];
if (file_exists($rateFile)) {
    $hits = json_decode(file_get_contents($rateFile), true) ?: [];
    $hits = array_filter($hits, fn($t) => $t > $now - 3600);
}
if (count($hits) >= $RATE_LIMIT_PER_IP_PER_HR) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Too many requests. Try again in an hour.']);
    exit;
}
$hits[] = $now;
file_put_contents($rateFile, json_encode(array_values($hits)), LOCK_EX);

// ---------- SAVE TO JSON FILE ----------
$entry = [
    'id'        => bin2hex(random_bytes(8)),
    'timestamp' => date('c'),
    'ip'        => $ip,
    'ua'        => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250),
    'name'      => $name,
    'email'     => $email,
    'subject'   => $subject,
    'message'   => $message,
];

$messages = [];
if (file_exists($DATA_FILE)) {
    $existing = file_get_contents($DATA_FILE);
    $messages = $existing ? json_decode($existing, true) : [];
    if (!is_array($messages)) $messages = [];
}
$messages[] = $entry;
file_put_contents($DATA_FILE, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

// also append to a CSV for easy export
$csvFile = $DATA_DIR . '/messages.csv';
$isNew = !file_exists($csvFile);
$fp = fopen($csvFile, 'a');
if ($isNew) fputcsv($fp, ['timestamp', 'name', 'email', 'subject', 'message', 'ip']);
fputcsv($fp, [$entry['timestamp'], $name, $email, $subject, $message, $ip]);
fclose($fp);

// ---------- SEND EMAIL ----------
$emailBody  = "New contact form submission\n\n";
$emailBody .= "Name:    $name\n";
$emailBody .= "Email:   $email\n";
$emailBody .= "Subject: $subject\n";
$emailBody .= "IP:      $ip\n";
$emailBody .= "Time:    " . $entry['timestamp'] . "\n\n";
$emailBody .= "--- Message ---\n$message\n";

$headers  = "From: $FROM_EMAIL\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($TO_EMAIL, "[Portfolio] $subject — from $name", $emailBody, $headers);

// ---------- RESPONSE ----------
echo json_encode([
    'ok' => true,
    'id' => $entry['id'],
    'message' => 'Message received. Reply within 24 hours.'
]);
