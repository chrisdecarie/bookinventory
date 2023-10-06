<?php
require_once "includes/connect.php";

$results = [];
$insertedRows = 0;

// Define the SQL query for inserting a new book
function insertBook($link, $title, $publication_year, $authorID)
{
    $query = "INSERT INTO book (title, publication_year, authorID) VALUES (?, ?, ?)";

    // Prepare the SQL statement
    if ($stmt = mysqli_prepare($link, $query)) {
        // Bind parameters and execute the statement
        mysqli_stmt_bind_param($stmt, "sii", $title, $publication_year, $authorID);
        mysqli_stmt_execute($stmt);

        // Get the number of inserted rows
        $insertedRows = mysqli_stmt_affected_rows($stmt);

        if ($insertedRows > 0) {
            return [
                "success" => true,
                "message" => "Book inserted successfully.",
            ];
        } else {
            return [
                "success" => false,
                "message" => "Failed to insert book.",
            ];
        }
    } else {
        return [
            "success" => false,
            "message" => "Error in query preparation: " . mysqli_error($link),
        ];
    }
}

// Check if the request contains the necessary data
if (
    isset($_POST["title"]) &&
    isset($_POST["publication_year"]) &&
    isset($_POST["authorID"])
) {
    // Call the insertBook function to insert the book
    $insertResult = insertBook($link, $_POST["title"], $_POST["publication_year"], $_POST["authorID"]);

    $results[] = $insertResult;
} else {
    $results[] = [
        "success" => false,
        "message" => "Required data is missing.",
    ];
}

// Encode the results array as JSON and echo it
echo json_encode($results);

// Close the database connection
mysqli_close($link);
