<?php

$host = "localhost:3306";
$db = "rayan89_demo_db";
$user = "chat_user";
$pass = "Rayan_1996";

$link = mysqli_connect($host, $user, $pass, $db);

$db_response = [];
$db_response['success'] = 'not set';

if (!$link) {
    $db_response['success'] = false;
} else {
    $db_response['success'] = true;
}

//echo json_encode($db_response);
