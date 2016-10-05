<?php

class view {

	function __construction() {

	}

	public function generate($view, $data=array()){
		include W_PATH.'/app/views/template.php';
	}
	
	public function response_json($data=array()){
		#var_dump($data);
		echo json_encode($data);
	}
}
