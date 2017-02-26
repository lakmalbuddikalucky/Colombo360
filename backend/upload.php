<?php

$servername = "localhost";
$username = "root";
$password = "12345";
$dbname = "colombo360";

$uploadOk = 1;
$imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);

$title = "rfrfr";
$location = "rfrfrfrfr";
$description = "rfrgfdsdfsfgsrf";

$title = $_POST["title"];

$location = $_POST["location"];

$description = $_POST["description"];


// Check if image file is a actual image or fake image
if (isset($_POST["submit"])) {
    echo $title;
    echo $location;
    echo $description;
    $temp = explode(".", $_FILES["fileToUpload"]["name"]);
    $newfilename = round(microtime(true)) . '.' . end($temp);
    move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], "img/photosphere/" . $newfilename);
    saveImage1($newfilename, $servername, $username, $password, $dbname, $title, $location, $description);
}


// Check if $uploadOk is set to 0 by an error


/*$maxDim = 300;
$fn = $_FILES['fileToUpload']['tmp_name'];
$size = getimagesize($fn);
$ratio = $size[0] / $size[1]; // width/height
if ($ratio > 1) {
    $width = $maxDim;
    $height = $maxDim / $ratio;
} else {
    $width = $maxDim * $ratio;
    $height = $maxDim;
}
$src = imagecreatefromstring(file_get_contents($fn));
$dst = imagecreatetruecolor($width, $height);
imagecopyresampled($dst, $src, 0, 0, 0, 0, $width, $height, $size[0], $size[1]);*/


function saveImage1($file, $servername, $username, $password, $dbname, $title, $location, $description)
{
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $qry2 = "INSERT INTO `photosphere`(`user_id`,`name`,`photo_id`,`upload_date`, `photo_location`,`description`) VALUES ('1','" . $title . "','" . $file . "',CURDATE(),'" . $location . "','" . $description . "')";
    $result = $conn->query($qry2);
    if ($result) {
        echo "<br/>File attached";
    } else {
        echo "<br/>File not attached!!!";
    }
}

?>
?>