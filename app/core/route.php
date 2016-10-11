<?php

class Route {
	private $registry;
	function __construct() {
	
	}

	public static function Start() {
		$registry = new Registry;
		$db = new PDO('mysql:host=localhost;dbname=bbb', 'bbb', 'bbb');
		$registry->set('db', $db);

		$controller_name ='index';
		$action_name = 'index';
		$action_parametrs = array();
		$route_array = explode('/', $_SERVER['REQUEST_URI']);
		if (!empty($route_array[2])) {
			$controller_name = $route_array[2];
		}
		
		if (!empty($route_array[3])) {
			$action_name = $route_array[3];
		}
		$model_name = 'model_'. $controller_name;
		$controller_name = 'controller_'.$controller_name;
		$action_name = 'action_'.$action_name;

		#echo "model:".W_PATH.'/app/models/'.$model_name.'.php'."<br>";
		if ( file_exists(W_PATH.'/app/models/'.$model_name.'.php')) {
			include W_PATH.'/app/models/'.$model_name.'.php';
		}

		#echo "controller:".W_PATH.'/app/controllers/'.$controller_name.'.php'."<br>";
		if (file_exists(W_PATH.'/app/controllers/'.$controller_name.'.php')) { 
			include W_PATH.'/app/controllers/'.$controller_name.'.php';
		}
		else {
			header('Location: '.conf_home_dir.'404');
			exit;
		}

		
		$controller = new $controller_name();
		$controller->$action_name($registry);


		
	}
}

