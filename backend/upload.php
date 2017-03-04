<?php

$servername = "localhost";
$username = "intern";
$password = "";
$dbname = "colombo360";

// Check if image file is a actual image or fake image
if (isset($_POST["submit"])) {
    $uploadOk = 1;
    $title = $_POST["title"];

    $location = $_POST["location"];
    $lat = $_POST["lat"];
    $lng = $_POST["lng"];

    $description = $_POST["description"];


    $target_dir = "img/photosphere/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);

    $temp = explode(".", $_FILES["fileToUpload"]["name"]);
    $newfilename = round(microtime(true)) . '.' . end($temp);
    if(checkType($_FILES["fileToUpload"]["tmp_name"]))
    {
        move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], "../img/photosphere/" . $newfilename);
        make_thumb("../img/photosphere/" . $newfilename,"../img/display_img/" . $newfilename,500);
        error_log("Upload Temp File: ". $_FILES["fileToUpload"]["tmp_name"]);
        error_log("Upload Permanant File: "."img/photosphere/" . $newfilename);
        error_log("Working Directory: ". getcwd());
        $result = saveImage1($newfilename, $servername, $username, $password, $dbname, $title, $location,$lat,$lng, $description);
        if($result)
        {
            echo "1";
        }
        else{
            header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
            echo "Error Updating DB";
        }

    }
    else{
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo "Invalid Image Dimensions";
    }

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

function checkType($target_file)
{
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    $source = null;
    switch($imageFileType){
        case 'jpg':
            $source = imagecreatefromjpeg($target_file);
            break;
        case 'jpeg':
            $source = imagecreatefromjpeg($target_file);
            break;

        case 'png':
            $source = imagecreatefrompng($target_file);
            break;
        case 'gif':
            $source = imagecreatefromgif($target_file);
            break;
        default:
            $source = imagecreatefromjpeg($target_file);
    }

    $width = imagesx($source);
    $height = imagesy($source);
    imagedestroy($source);
    echo "Width: ".$width;
    echo "Height: ".$height;
    echo "W/H:".($width/$height);
    if ($width > $height * 1.8 and $width < $height * 2.2)
    {
        return 1;
    }
    return 0;
}

function saveImage1($file, $servername, $username, $password, $dbname, $title, $location,$lat, $lng, $description)
{
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $qry2 = "INSERT INTO `photosphere`(`user_id`,`name`,`photo_id`,`upload_date`, `photo_location`,`photo_lat`,`photo_lng`,`description`) VALUES ('1','" . $title . "','" . $file . "',CURDATE(),'" . $location . "','" . $lat . "','" . $lng . "','". $description . "')";
    error_log($qry2);
    $result = $conn->query($qry2);
    if ($result) {
        return 1;
    }
    else{
        return 0;
    }
}


function make_thumb($src, $dest, $desired_width) {

    $imageFileType = strtolower(pathinfo($src, PATHINFO_EXTENSION));
    $source = null;
    switch($imageFileType){
        case 'jpg':
            $source = imagecreatefromjpeg($src);
            break;
        case 'jpeg':
            $source = imagecreatefromjpeg($src);
            break;

        case 'png':
            $source = imagecreatefrompng($src);
            break;
        case 'gif':
            $source = imagecreatefromgif($src);
            break;
        default:
            $source = imagecreatefromjpeg($src);
    }

    $width = imagesx($source);
    $height = imagesy($source);

    /* find the "desired height" of this thumbnail, relative to the desired width  */
    $desired_height = floor($height * ($desired_width / $width));

    /* create a new, "virtual" image */
    $virtual_image = imagecreatetruecolor($desired_width, $desired_height);

    /* copy source image at a resized size */
    imagecopyresampled($virtual_image, $source, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);

    /* create the physical thumbnail image to its destination */

    switch($imageFileType){
        case 'jpg':
            imagejpeg($virtual_image, $dest);
            break;
        case 'jpeg':
            imagejpeg($virtual_image, $dest);
            break;

        case 'png':
            imagepng($virtual_image, $dest);
            break;
        case 'gif':
            imagegif($virtual_image, $dest);
            break;
        default:
            imagejpeg($virtual_image, $dest);
            break;
    }
}


?>
