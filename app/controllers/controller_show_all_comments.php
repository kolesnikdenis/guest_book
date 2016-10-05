<?php

class controller_index extends controller {

        function __construct(){

        }

	public function action_index(){
                $view = new view();
                echo $view->generate('show_all_comments',$model->getName());
        }

}

