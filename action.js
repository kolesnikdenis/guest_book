
var upload = upload  || {};

upload.file = {
 files_a: [],
 send_files: function(){
    event.stopPropagation();
    event.preventDefault();
    var data = new FormData();
    $.each( upload.file.files_a, function( key, value ){
	data.append( key, value );
    });
    if (data.getAll('0').length>0){
     $.ajax({
	url: '/work1/add/load_file_to_server',
	type: 'POST',
	data: data,
	cache: false,
	dataType: 'json',
	processData: false,
	contentType: false,
	success: function( respond, textStatus, jqXHR ){
	    if( typeof respond.error === 'undefined' ){
		var files_path = respond.files;
		var html = '';
		$.each( files_path, function( key, val ){ html += val +'<br>'; } )
		$('.load_file_status').html( html );
		                console.log(respond);
                console.log(textStatus);
                console.log(jqXHR);
		upload.comment.add_comment(respond.files);
	    }
	    else{
		$('.load_file_status').html( 'Ошибка: сервер не отвечает: ' + respond.error );
		console.log(respond);
		console.log(textStatus);
		console.log(jqXHR);
		alert("Файловый сервер не отвечает, попробуйте разместить сообщение без прикрепленного файла");

	    }
	},
	error: function( jqXHR, textStatus, errorThrown ){
		console.log(errorThrown);
		console.log(textStatus);
		console.log(jqXHR);
	    $('.load_file_status').html( 'Ошибка запроса: ajax:' + textStatus + ':\\');
		alert("Ошибка обработки файла на сервере status: '"+textStatus+"'\n попробуйте разместить сообщение без прикрепленного файла");
	}
     });
    } else { upload.comment.add_comment('');  }

 }
}


upload.comment = {
  add_comment: function(in_file){
	  var check_body = check_input_tag( $("#text_body").val() ) ;
	  $.ajax({
		type: 'post',
		url: 'http://kolesnikdenis.com/work1/add/add_comment',
		data: {
			'parent':$("#parent").val(),
			'user': $("#user").val(),
			'email': $("#email").val(),
			'homepage': $("#homepage").val(),
			'body': check_body,
			'file': in_file
		},
		dataType: 'json',
		success: function(data) {
			$("input[type=text]").val('');
			$("#file").val('');
			$("#text_body").val('');
			grecaptcha.reset(core_captcha.captcha_id);
			if ( $('li#menu_ul_preview').length > 0 ) {  $('li#menu_ul_preview').html(""); } 
			$('.select').removeClass("green");
 			$('.select').addClass("red");
			var a = new Array();
			data.file=data.id;
			a[0]=data;
			o_show.show.display_msg(a);
		}
	  }).fail(function(data) {
			alert( "error" );
	  });
  }

}


var test = test  || {};
test = { 
 test_allow_submit: function(){
	if ( ( $("#user").val().length >1 ) && (  valid_email($("#email").val()) != false ) && ( $("#text_body").val().length ) ) {
		$("input[type=submit]").removeAttr("style").removeAttr("disabled");
        }else {
		$("input[type=submit]").attr("style", "visibility: hidden ").attr("disabled","true");
	}
 },

 check_on_execution: function(){
	if ( ( $("#user").val().length <= 1 ) ||  (  valid_email($("#email").val()) != true )  || ($("#email").val().length <= 1) || ( $("#text_body").val().length <=1 ) ) {
		alert("не заполенны обязательные поля");
		return 1;
	} else {
		upload.file.send_files();
	}
 }
}

var core_captcha =  {};
core_captcha = {
captcha_id: 0,
/*var onloadc = function() {
	captcha_id= grecaptcha.render('captcha', {
	  'sitekey' : '6Lef1gYUAAAAAJjL0qre-8ixW54jyNJbaPnXz4ZK'
	});
  };
*/
 onloadc: function(){
		 core_captcha.captcha_id= grecaptcha.render('captcha', {
				'sitekey' : '6Lef1gYUAAAAAJjL0qre-8ixW54jyNJbaPnXz4ZK'
		})
 },

 check_capcha: function(){
		$.ajax({
			type: "POST",
			url: "/work1/c.php",
			data: "&g-recaptcha-response=" + grecaptcha.getResponse(core_captcha.captcha_id)
		}).done(function(status) {
				grecaptcha.reset(core_captcha.captcha_id);
			if (status == "ok") {
				test.check_on_execution();
			}
			else {
				alert("капча не проверрена");
				return 1;
			}

		});
 }
}

var onloadc = function() {
    core_captcha.captcha_id= grecaptcha.render('captcha', {
      'sitekey' : '6Lef1gYUAAAAAJjL0qre-8ixW54jyNJbaPnXz4ZK'
    });
  };




function form_answer(id_parent) {
 $("#write_answer"+old_form).html('<a href=# onclick="form_answer('+old_form+');">написать тут</a>');
 var sel_div = $("#write_answer"+id_parent);
 old_form=id_parent;
 
 var input_parent_id=$('<input />', { type: 'hidden', value: id_parent, id: 'parent'});
 var input_user =$('<div />', { class: "select"}).append( '<label id=info>Имя пользователя: </label>').append('<input type="text" name="user" placeholder="Имя пользователя" id=user>').append('*<label class="txt"> не менее 2х символов</label><br>');;
 var input_email = $('<div />', { class: "select"}).append( '<label id=info>E-Mail:</label>').append('<input type="text" id="email" name="email" placeholder="почтовый ящик">').append('* <label class="txt"> Валидный E-Mail (xx@xx.xx)</label><br>');
 var input_homepage = $('<div />', { class: "select"}).append( '<label id=info>Домашяя страничка:</label>').append('<input type="text" id="homepage"  name="homepage" placeholder="Домашняя страница">').append('<br>');
 var input_body =$('<div />', { class: "select"}).append( '<label id=info>Cообщение:</label>').append('<div id=txt_btn></div><textarea  rows="7"  type="text" id="text_body" name="text_body" placeholder="Тело сообщения">').append('*<label class="txt"> не менее 2х символов</label><br>');
 var input_capcha = $('<div />', { class: "select"}).append( '<label id=info>Проверка на человека:</label>').append('<div class="g-recaptcha" id="captcha" style="transform:scale(0.78)" data-sitekey="6Lef1gYUAAAAAJjL0qre-8ixW54jyNJbaPnXz4ZK">').append('<br>');
 var input_file =  $('<div />', { class: "file"}).append( '<label id=info>Прикрепить файл:</label>').append('<input type="file" id="file" name="user" multiple="multiple" accept=".txt,image/*">').append('<br>');
 var input_btn_submit =  $('<div />', { class: "submit button"}).append('<label />').append('<input type=submit value="оставить отзыв" style="visibility: hidden" onclick="return false;"> ').append('<br>');
 var input_btn_preview =  $('<div />', { class: "preview button"}).append('<label />').append('<input type=submit value="предварительный просмотр" style="visibility: hidden" onclick="return false;"> ').append('<br>');
 var elem_form = $('<lavel />', {id: 'i'}).append('Заполните обязательные поля - *<br>');
 //elem_form.append('<lavel id="i">Заполните обязательные поля - *</lavel><br>');
 elem_form.append(input_parent_id);
 elem_form.append(input_user);
 elem_form.append(input_email);
 elem_form.append(input_homepage);
 elem_form.append(input_body);
 elem_form.append(input_capcha);
 elem_form.append(input_file);
 elem_form.append(input_btn_submit );
 elem_form.append(input_btn_preview);
 
 var form =$('<form />',{ id:'add_comment', onchange: "test.test_allow_submit()"}).append(elem_form);

 form.append('<div class="load_file_status"></div>');
 sel_div.append(form);
 $.get("/work1/app/views/btn_control.html",function (data) {
  		$('#txt_btn').append(data);
	});

 if ( typeof(grecaptcha) !== "undefined") {
	core_captcha.onloadc();
 }
  
$('.submit.button').click(function( event ){
    core_captcha.check_capcha();
});

$('.preview.button').click(function( event ){
	var body_text = check_input_tag($("#text_body").val());
	var data_preview={user:  $("#user").val(), mail: $("#email").val(), homepage: $("#homepage").val(), body: body_text, parent_id: $("#parent").val(), file: 0, id: 'preview'};
	var a = new Array();
	a[0]=data_preview;
	if ( $('li#menu_ul_preview').length > 0 ) { $('li#menu_ul_preview').html(""); } 
	o_show.show.display_msg(a);
});


$('.select').change(function() {
   if ( ( ($(this).children('[type=text]').attr('id') =="email" ) &&  (valid_email($(this).children('[type=text]').val()) ) ) ||  ( ($(this).children('[type=text]').attr('id') !="email" )  &&  ( $(this).children('[type=text]').val().length >1 )) ) {
     $(this).removeClass("red");
     $(this).addClass("green");
   }
   else {
     $(this).removeClass("green");
     $(this).addClass("red");
   }
})
$('input[type=file]').change(function(){
    upload.file.files_a = this.files;
    var val = $(this).val().toLowerCase();
    var regex = new RegExp("(.*?)\.(txt|gif|png|jpeg|jpg)$");
    if(!(regex.test(val))) {
      $(this).val('');
      alert('Загрузка возможно только изображений и текстовых файлов');
    }
    var regex = new RegExp("(.*?)\.(txt)$");
    if((regex.test(val))) {
        if ( upload.file.files_a[0].size > 102400 )  {
                alert("файл слишком влеик ((\nзагружаеммый текстовый файл должен быть меньше 100kb");
        }
    }

});

}


var old_form=0;
form_answer(0);


