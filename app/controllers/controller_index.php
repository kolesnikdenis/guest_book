<?php 

class controller_index extends controller {

	function __construct(){
	
	}

	public function action_show_json(){
                $view = new view();
		$model = new model_index();
		#$view->generate('show_all_comments',$model->show_json());

                $view->response_json($model->show_json());
        }

	public function action_show_file(){
		$view = new view();
		$model = new model_index();
		$view->generate('show_file', $model->show_file());
	}

	public function action_show_img(){
		$view = new view();
		$model = new model_index();
		$model->show_img();
		#$view->generate('show_file', $model->show_img());
	}

}
