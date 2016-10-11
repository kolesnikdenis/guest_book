<?php 

class model_add extends model {
	protected $controller;
	protected $registry;
	function __construct(){ 

	}


/*  --------------------- */
public function validation_link($str){
	$regexp = '/(<a .*?>)(\n?.*?\n?)(<\/a>)/im';
	$t = preg_match_all($regexp, $str, $out);
	for($i=0; $i<$t; $i++){
	$out = strtolower($out[1][0]).htmlentities($out[2][0]).strtolower($out[3][0]);
	}
	return $out;
}

function work_over_tag($str,$tag){
	$re = '/(<'.$tag.'>)(.*?[^\r]?)(<\/'.$tag.'>)/i';
	$t =preg_match_all($re, $str, $matches);
	if ($t > 0 ) {
		$num_find = strpos($str,$matches[0][0]);
		$out= substr($str,0,$num_find).strtolower($matches[1][0]). htmlentities($matches[2][0]).strtolower($matches[3][0]).substr($str,(strlen($matches[0][0])+$num_find),(strlen($str)-($num_find)));
		return $out;
	}
	else {
		return $str;
	}
}

public function remove_tag_inside($str){
	$model = new model_add();
	$str = $model->work_over_tag($str,'code');
	$str = $model->work_over_tag($str,'strong');
	$str = $model->work_over_tag($str,'i');
	return $str;
}

public function test_close_tags($str) {
	$str = preg_replace('/<?\/*.br*.?\/?>/i',"",$str);
	preg_match_all('~<([a-z0-9]+)(?: .*)?(?<![/|/ ])>~iU', $str, $result);
	$o_tag = $result[1];
	preg_match_all('~</([a-z0-9]+)>~iU', $str, $result);
	$c_tag = $result[1];
	$l_open = count($o_tag);
	if (count($c_tag) == $l_open) {
		return 1;
	}
	else {
		return 0;
	}
}

public function check_input_tag($str) {
	$model = new model_add();

	$str=str_replace(array("\r\n", "\n", "\r"), "<br/>\n",$str);
	$out = strip_tags($str,"<a><i><strong><code><br>");
	$t = preg_match_all('/<a .*?>*?<\/a>/i', $out, $out1);
	$last_index_sub=0;
	$tmp_text="";
	for($i=0; $i<$t; $i++){
		$num_find = strpos($out,$out1[0][$i]);
		$return_link	= $model->validation_link( $out1[0][$i] );
		$out= substr($out,0,$num_find).$return_link. substr($out,(strlen($out1[0][$i])+$num_find),(strlen($out)-($num_find)));
	}

	$out = $model->remove_tag_inside($out);
	if ( $model->test_close_tags($out) == 0) {
		return htmlentities($out);
	}
	return $out;
}

/*   --------------------- */


	public function getName() {
		return array('Animal');
	}

	public function add_comment(){
	 $model = new model_add();
	 $body_text =  $model->check_input_tag($_POST['body']);
	 $file="";
         if (isset($_POST['file'][0]) ) { $file=$_POST['file'][0]; }

		if(isset($_POST['user'])){
			$date = date('Y-m-d H:i:s');
			$results = array(
				'user' => $_POST['user'],
				'mail' => $_POST['email'],
				'homepage' =>  $_POST['homepage'],
				'body' =>  $body_text,
				'parent_id' => $_POST['parent'],
				'file' => $file,
				'date_time' => $date
			);
			$db = $this->DB();
			$SQL="INSERT INTO `bbb`.`comments` ( `parent_id`, `date_time`, `user`, `mail`, `homepage`, `body`, `file`) VALUES ".
					"(:parent_id, :date_time, :user, :mail, :homepage, :body, :file);";
		
			$query=$db->prepare($SQL);
			$query->execute($results);
			$results['id']  = $db->lastInsertId();
			return $results;
		}
		else { 
			return array('error input nickname');
		}
	}


	public function imgresize($in_file,$out_file, $out_w, $out_h, $q) {
		$im;
		switch ( exif_imagetype($in_file) ) {
			case '2':
			 $im = imagecreatefromjpeg($in_file);
			 break;
			case '3':
			 $im = imagecreatefrompng($in_file);
			 break;
			case '1':
			 $im = imagecreatefromgif($in_file);
			 break;
			default:
			 die('Invalid image type: '.exif_imagetype($in_file). ' ' . $in_file );

		}

		//$im=imagecreatefromjpeg($in_file);
        	$k1=$out_w/imagesx($im);
		$k2=$out_h/imagesy($im);
		$k=$k1>$k2?$k2:$k1;
		$w=intval(imagesx($im)*$k);
		$h=intval(imagesy($im)*$k);
		$im1=imagecreatetruecolor($w,$h);
		imagecopyresampled($im1,$im,0,0,0,0,$w,$h,imagesx($im),imagesy($im));
		imagejpeg($im1,$out_file,$q);
		imagedestroy($im);
		imagedestroy($im1);

	}

	public function load_file_to_server(){
		$model = new model_add();
		if( isset($_FILES[0]['name'] ) ){
		 $file=$_FILES[0];
		 $error = false;
		 $files = array();
		 $uploaddir=W_PATH."/upload/";
		 if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );
			if( move_uploaded_file( $file['tmp_name'], $uploaddir . basename($file['name']) ) ){
				$files[] = realpath( $uploaddir . $file['name'] );
			}
			else { 
				$error = true;
			}
		
		//$data = $error ? array('error' => 'Ошибка загрузки файлов.') : array('files' => $files);
		$in_file=$uploaddir.basename($file['name']);
		$data = $error ? array('error' => 'Ошибка загрузки файлов.') : array('files' => $files, 'type' =>  exif_imagetype($in_file));
		if ( (exif_imagetype($in_file) == '1') || ( exif_imagetype($in_file) == IMAGETYPE_PNG ) || ( exif_imagetype($in_file) == IMAGETYPE_JPEG) ) {
			if  ( ( getimagesize($in_file)[0]> 320 ) || ( getimagesize($in_file)[1] > 240 ) ){ 
				$tmp_file="/tmp/tmp_resize";
				$model->imgresize($in_file,$tmp_file,320,230,75);
				rename("/tmp/tmp_resize",$in_file);
			};
		}

		return $data;
		}	
	}

	public function add(){  return array('blinnnnnnnnnnnnnnnn','ii'); }
	
	
}
