<?php
require_once "includes/connect.php";

$results = [];

// Check if the request contains the necessary data
if (isset($_POST["authorName"])) {
    // Get the author's name from the POST data
    $authorName = $_POST["authorName"];

    // Define the SQL query to retrieve the author_id based on the author's name
    $query = "SELECT authorID FROM authors WHERE name = ?";

    // Prepare the SQL statement
    if ($stmt = mysqli_prepare($link, $query)) {
        // Bind the author's name as a parameter
        mysqli_stmt_bind_param($stmt, "s", $authorName);
        // Execute the statement
        mysqli_stmt_execute($stmt);
        // Get the result
        $result = mysqli_stmt_get_result($stmt);

        if ($row = mysqli_fetch_assoc($result)) {
            // Author found, return the author_id
            $results["authorID"] = $row["authorID"];
        } else {
            // Author not found, return an error message
            $results["error"] = "Author not found.";
        }
    } else {
        // Error in query preparation
        $results["error"] = "Error in query preparation: " . mysqli_error($link);
    }
} else {
    // Required data is missing
    $results["error"] = "Required data is missing.";
}

// Encode the results array as JSON and echo it
echo json_encode($results);

// Close the database connection
mysqli_close($link);
