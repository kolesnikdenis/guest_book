<?php

class controller_404 extends controller {

	function __construction() {
	
	}

	public function action_index(){
		$view = new view();
		echo $view->generate('404');
        }

}
