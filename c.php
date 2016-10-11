<?php
    // assemble the message from the POST fields

    // getting the captcha
    $captcha = '';
    if (isset($_POST['g-recaptcha-response']))
        $captcha = $_POST['g-recaptcha-response'];

    if (!$captcha)
        echo 'The captcha has not been checked.';
        $secret = '6Lef1gYUAAAAADLqRIglTjszi4Ht4IiJ4xCc_Zbv';
	$url="https://www.google.com/recaptcha/api/siteverify?secret=".$secret."&response=".$captcha."&remoteip=".$_SERVER['REMOTE_ADDR'];
	#echo $url;
        $response = json_decode(file_get_contents($url), true);

    if ($response['success'] != false) {
        echo 'ok';
    } else {
        echo 'not ok';
    }
?>
