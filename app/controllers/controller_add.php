<?php

class controller_add extends controller {


	function __construction() {
	
	}

	public function action_index(){
		$view = new view();
		$model = new model_add();
		$view->generate('add', $model->getName());
        }

	public function action_add_comment(){
		$view = new view();
                $model = new model_add();
		$view->response_json($model->add_comment());
		
	}
	public function action_load_file_to_server(){
		$view = new view();
		$model = new model_add();
		$view->response_json($model->load_file_to_server());
	}
}
