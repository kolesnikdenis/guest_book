var editor = editor  || {};

editor = {
  easy_tag: function(st,et){
	array = editor.getSelection($("#text_body"));
	text=$('#text_body').val();
	text = text.substr(0,array.s) +st+text.substring(array.s,array.e)+et+text.substring(array.e,text.length);
	$('#text_body').val(text);
  },

 hard_tag: function(type){
	array = editor.getSelection($("#text_body"));
	text=$('#text_body').val();
	var url="";
	var link="";
	if (-1 < array.txt.indexOf('http://')){ 
		link=prompt("введите описание","ссылка тут");
		url=array.txt;
		
	}else { 
		url=prompt("введите URL","http://");
		link=array.txt;
	};
	if (type=='a'){
		text = text.substr(0,array.s) +"<a href='"+url+"'>"+link+"</a>"+text.substring(array.e,text.length);
	}else { 
		text = text.substr(0,array.s) +"<img src='"+url+"' title='"+link+"' width=100>"+text.substring(array.e,text.length);
	}
	$('#text_body').val(text);

	
	
 },

 getSelection: function(elem){
  if(typeof elem != "undefined"){
   s=elem[0].selectionStart;
   e=elem[0].selectionEnd;
   return {'s': s, 'e': e, 'txt': elem.val().substring(s, e) };
  }else{
   return '';
  }
 }
}

 $("#text_body").each(function () {
    $('option', this).each(function () {
        if ($(this).val().toLowerCase() == someName) {
            $(this).attr('selected', 'selected')
        };
    });
 });
