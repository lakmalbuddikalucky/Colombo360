<?php
session_start();
error_reporting(-1);
include 'connection.php';

/*$servername = "127.0.0.1";
$username = "root";
$password = "123456789";*/
$servername = "localhost";
$username = "intern";
$password = "";

//load JSON file and decode it to an array object
$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);
$dataToSend = "";

//to make the connection to the Database
$GLOBALS[connection] = new connection($servername, $username, $password);

//To check whether a user exist
if ($request['query'] === "checkUserExist") {
    $dataToSend = $GLOBALS[connection]->checkUserExist($request['data']);
}

//The query to get items from the news feed
if($request['query'] === "getNewsfeedItems"){
    $dataToSend = $GLOBALS[connection]->getNewsfeedItems();
}

// login query
if ($request['query'] === "checklogin") {
    $user = $GLOBALS[connection]->checklogin($request['data']);
    $dataToSend = $user;
    /*if ($user) {
        $_SESSION['user'] = $user;
        $dataToSend = $user;
    }
    else {
        $dataToSend = false;
    }*/
}

//user infomation
if ($request['query'] === "userinfo") {
    $dataToSend = $_SESSION['user'];
}

//prepare data for sending by encoding object to JSON (convert to utf-8)
foreach ($dataToSend as $i => $entry) {
    $dataToSend[$i][0] = utf8_encode($dataToSend[$i][0]);
}

$json = json_encode($dataToSend);
//send JSON back to the JS file
$GLOBALS[connection]->close();
echo $json;