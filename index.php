<?php
error_reporting(E_ALL | E_STRICT);
// определяем режим вывода ошибок
//ini_set('display_errors', 'On');
define ("W_PATH", dirname(__FILE__));
$config_arr = parse_ini_file("config.ini", true);
define ("conf_home_dir", $config_arr["home_dir"]["dir"] );
include W_PATH.'/app/bootstrap.php';
