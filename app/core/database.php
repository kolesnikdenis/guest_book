<?php
abstract class baseModel1{

    private $engine;
    private $host;
    private $database;
    private $user;
    private $pass;
    
    private static $_db = NULL;
    
    private function __construct(){}
    private function __sleep(){}
    private function __wakeup(){}
    private function __clone(){}
 
    public static function DB()
    {
        if(NULL === self::$_db)
	    return $db = new PDO('mysql:host=localhost;dbname=bbb', 'bbb', 'bbb');

        return self::$_db;
    }
}

?>
