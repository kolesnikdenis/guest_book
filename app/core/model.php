<?php

class model {
	private static $db = NULL;
	public $db1;
	

	public function DB() {
		if(NULL === self::$db){
			$conf = parse_ini_file("config.ini", true);
			self::$db = new PDO('mysql:host='.$conf["mysql"]["host"].';dbname='.$conf["mysql"]["db"], $conf["mysql"]["user"], $conf["mysql"]["pass"] );
		}
		return self::$db;
	}

	public function __construct() {

	}

}

Class Registry Implements ArrayAccess {
        private $vars = array();

        function offsetExists($offset) {
                return isset($this->vars[$offset]);
        }


        function offsetGet($offset) {
                return $this->get($offset);
        }


        function offsetSet($offset, $value) {
                $this->set($offset, $value);
        }


        function offsetUnset($offset) {
                unset($this->vars[$offset]);
        }


        function set($key, $var) {
                if (isset($this->vars[$key]) == true) {
                        throw new Exception('Unable to set var `' . $key . '`. Already set.');
                }
                $this->vars[$key] = $var;
                return true;
        }


        function get($key) {
                if (isset($this->vars[$key]) == false) {
                        return null;
                }
                return $this->vars[$key];
        }


        function remove($var) {
                unset($this->vars[$key]);
        }

}


