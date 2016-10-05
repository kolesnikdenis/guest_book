<?php

class controller {
	
	function __construction() {

	}

	
	public function  connect_db() { 
		return $db = new PDO('mysql:host=localhost;dbname=bbb', 'bbb', 'bbb');
	}
	public function action_index(){
		$model = new model_index();
		$view = new view();
		#$view->generate('index',$model->show_comments());
		$view->generate('index');
		#$view->response_json($model->show_comments());

	}


}
