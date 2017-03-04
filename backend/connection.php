<?php

define("db1", "colombo360");
$GLOBALS[usedDB] = db1;

class connection
{
    var $connection;

    function connection($servername, $username, $password)
    {
        $this->connection = new PDO("mysql:host=$servername;dbname=" . $GLOBALS[usedDB], $username, $password);
        $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->connection->exec("SET NAMES 'utf8'");
        return $this->connection;
    }

    function close()
    {
        $this->connection = null;
    }

    function startTransaction()
    {
        $this->connection->beginTransaction();
    }

    function commitTransaction()
    {
        $this->connection->commit();
    }

    function abortTransaction()
    {
        $this->connection->rollBack();
    }

    //Sending the user information of the user
    function checklogin($data)
    {
        return $this->connection->query("SELECT * FROM users WHERE email='" . $data['username'] . "' AND password=MD5('" . $data['password'] . "')")->fetchAll();
    }

    //function to check whether a user ecists in the system
    function checkUserExist($data)
    {
        $result = $this->connection->query("SELECT COUNT(*) FROM users WHERE users.email='" . $data["email"] ."')")->fetchAll();
        return $result[0];
    }

    //To get the items for the news feed of the main page
    function getNewsfeedItems()
    {
        return $this->connection->query("SELECT * FROM `photosphere` ORDER BY `id` DESC")->fetchAll();
    }

    function getMapPoints()
    {
        return $this->connection->query("SELECT `photo_lat`,`photo_lng` ,`id` FROM `photosphere` WHERE `photo_lat` IS NOT NULL;")->fetchAll();
    }

    function getPhotosphereDetails($id)
    {
        return $this->connection->query("SELECT * FROM `photosphere` WHERE `id` = '".$id."'")->fetchAll();
    }

}