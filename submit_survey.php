<?php
// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Database connection
    $host = "localhost";
    $username = "root";
    $password = "Your Password";
    $database = "survey";

    $conn = new mysqli($host, $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Get the POST data from the AJAX request
    $data = json_decode(file_get_contents("php://input"), true);

    if ($data === null) {
        http_response_code(400);
        echo "Invalid JSON";
        exit;
    }

    // Store the answers in the database
    $stmt = $conn->prepare("INSERT INTO survey_answers (question, answers) VALUES (?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo "Prepare failed: " . $conn->error;
        exit;
    }

    foreach ($data['answers'] as $index => $answers) {
        $question = "Question " . ($index + 1); // Replace with actual question text if needed
        $answers_str = implode(',', $answers); // Convert array of answers to a comma-separated string
        if (!$stmt->bind_param("ss", $question, $answers_str)) {
            http_response_code(500);
            echo "Bind failed: " . $stmt->error;
            exit;
        }
        if (!$stmt->execute()) {
            http_response_code(500);
            echo "Execute failed: " . $stmt->error;
            exit;
        }
    }

    $stmt->close();
    $conn->close();

    echo "Survey submitted successfully";
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
