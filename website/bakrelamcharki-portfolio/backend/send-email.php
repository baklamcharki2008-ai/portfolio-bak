<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$message = isset($input['message']) ? trim($input['message']) : '';
$language = isset($input['_language']) ? trim($input['_language']) : 'en';
$company = isset($input['company']) ? trim($input['company']) : '';

// Honeypot check
if ($company !== '') {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Message sent.']);
    exit;
}

// Validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

if (strlen($name) < 2 || strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Name must be at least 2 characters and message at least 10 characters.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
    exit;
}

$to = '1thomas8shelby1@gmail.com';
$subject = "Portfolio Contact from $name";
$body = "Name: $name\nEmail: $email\nLanguage: $language\n\nMessage:\n$message\n";

// Try SMTP via Gmail using PHPMailer if available, fallback to mail()
$sent = false;
$errorMsg = '';

if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = '1thomas8shelby1@gmail.com';
        $mail->Password = getenv('SMTP_PASSWORD') ?: '';
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->setFrom($email, $name);
        $mail->addAddress($to);
        $mail->addReplyTo($email, $name);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->send();
        $sent = true;
    } catch (Exception $e) {
        $errorMsg = $e->getMessage();
    }
}

if (!$sent) {
    // Fallback: native mail()
    $headers = "From: $email\r\nReply-To: $email\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
    if (mail($to, $subject, $body, $headers)) {
        $sent = true;
    } else {
        $errorMsg = error_get_last()['message'] ?? 'Unknown error';
    }
}

if ($sent) {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => '✓ Message sent — thanks! I\'ll get back to you soon.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to send message. Error: ' . $errorMsg]);
}
