<?php 

class model_index extends model {
	protected $view;
	protected $controller;
	protected $registry;
	function __construct(){ 

	}

	public function show_json(){ 
		$c= new controller();
		$db= $c->connect_db();
		$query=$db->prepare("select * from comments ");
		$query->execute();
		$items=array();
		for($i=0; $row = $query->fetch(); $i++){
			array_push($items,$row);
		}
		return $items;

	}
	



	public function show_file(){
		$c= new controller();
		$db =$c->connect_db();
		$route_array = explode('/', $_SERVER['REQUEST_URI']);
		$query=$db->prepare("select * from comments where id='".$route_array[4]."'");
		$query->execute();
		for($i=0; $row = $query->fetch(); $i++){
			$from_db_file_name=$row['file'];
			$test_file = explode('.', $from_db_file_name);
			if ($test_file[1] =="txt") {
				$handle = file_get_contents($from_db_file_name, false );
				$text= str_replace("\n", "",$handle );
				$text= str_replace("\"", "\\\"",$text );

				$text=substr($text,0,strlen($text)-1);
				return array('txt',$text);
			} else { 
				return array('img','<img src="/work1/index/show_img/'.$route_array[4].'">');
			}
		
                }
	}

	public function show_img(){
		$c= new controller();
		$db =$c->connect_db();
		$route_array = explode('/', $_SERVER['REQUEST_URI']);
		$query=$db->prepare("select * from comments where id='".$route_array[4]."'");
		$query->execute();
		for($i=0; $row = $query->fetch(); $i++){
			$from_db_file_name=$row['file'];
		    $image = getImageSize($from_db_file_name);
		    switch($image[2]) {
		    case 1:
			$img = imageCreateFromGIF($imageurl);
			header("Content-type: image/gif");
			echo imageGIF($img);
			break;
		    case 2:
		        $img = imageCreateFromJPEG($from_db_file_name);
			header("Content-type: image/jpeg");
			echo imageJPEG($img);
		        break;
		    case 3:
		        $img = imageCreateFromPNG($imageurl);
			header("Content-type: image/png");
			echo imagePNG($img);
		        break;
		     }
			
		}
	}
	public function show_comments(){
		$c=new controller();
		$db = $c->connect_db();
		$query=$db->prepare("select * from comments ORDER BY `comments`.`id` ASC");
		$query->execute();
		$comments="";
		for($i=0; $row = $query->fetch(); $i++){
		 /* $comments.="<div id=comment>".
			"<div id=u_line> <a href='mailto:".$row['mail']."'>".$row['user']."</a> id ". $row['id']." parent: ".$row['parent_id']."</div>" 
			."<div id=body>". $row['body']."</div>"
			."<div id=control><a href=# onclick=\"form_answer('".$row['id']."');\">ответить</a></div>"
			."</div>"
			."<div id=write_answer".$row['id']."></div>";
		 */
		}
		//return $comments."</ul>"; #$row = $query->fetch();
}

}
	
