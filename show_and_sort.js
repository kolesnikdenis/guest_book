var out1;
var o_show = o_show  || {};
o_show.show = {
  msg_in_page: 25,
  page: 0,
  type: "id",
  display_msg: function(data){
	var count_root_key= 0;//o_show.show.msg_in_page*o_show.show.page;
	_.forEach(data, function(value, key1) {
	  var ul = $('<ul />');
	  li = $('<li />', { id: "menu_ul_"+value.id});
	  var header_comment =$('<div />', { id: "u_line"});
	  var header_link="";
	  if ( value.file) {  link=$('<a />',{ href: "/work1/index/show_file/"+value.id, text:" ссылка на файл "} );} else { link=""};
	  if (value.mail.length>0)  { header_link  =$('<a />', { href: "mailto:"+ value.mail, text: value.user}); }
	  else { header_link=value.user}
	  header_comment.append("id: "+value.id+" - ").append(header_link).append(" - ").append(value.date_time);
	  var div_body =$('<div />', { id: "body"}).append(value.body);
	  var div_control =$('<div />', { id: "control"}).append('<a href=# onclick="form_answer(\''+value.id+'\');">ответить</a>');
	  div_control.append(link);
	  var div_answer=$('<div />', { id: "write_answer"+value.id});
	  if (value.id == "preview")  {
		div_control="";
		header_comment.append(" -- предварительный просмотр -- ");
	  };
	  var comment =$('<div  />', { id: "comment_"+value.id}).append(header_comment).append(div_body).append(div_control).append(div_answer);
	  li.append(comment);
	  ul.append(li);
	  if (value.parent_id == 0) {
		if ( value.id == "preview" ) {
          		$('#preview').append(ul);
			} else  {
				$('#all_comments').append(ul);
			}
	  } else {
		$('li#menu_ul_' + value.parent_id).append(ul);
	  }
	})

	var $code = $("code");
		$code.replaceWith(function () {
		codee=$('<code/>').html(this.innerHTML);
		return $('<pre/>').append(codee);
	});

        $(document).ready(function() {
         $('code').each(function(i, block) {
		new_text= ($(block).text()).replace(/(\<\/br\>)/g,"\r\n");
		$(block).html(new_text);
		hljs.highlightBlock(block,null,true);
         });
        });

  },
  show_message: function(data,t="r"){
	if ( t == "r"){ 
		o_show.show.display_msg(data);
	}
	_.forEach(data, function(value, key1) {
	  if (value.tree.length> 0){
		o_show.show.display_msg(value.tree);
		o_show.show.show_message(value.tree,"d");
	  }
	})
  },
  create_link: function(){
	page =  Math.ceil((out1.length/o_show.show.msg_in_page));
	var a="Страницы: ";
	for ( i=0; i<page; i++) {
		if (o_show.show.page == i) { a+= (i+1);}
		else { a += "<a href=# onclick='o_show.show.show_page("+i+");'>"+(i+1)+"</a>" ; }
		if ((i+1) != page) { a+= " - "; }
	}
	$("#link_page").html(a);
  },
  show_page: function(num){
	o_show.show.page=num;
	$('#all_comments').html("");
	var data=[];
	_.forEach(out1, function(value, key1) {
		if ( ( (o_show.show.msg_in_page*o_show.show.page) <= key1 ) && ( (( (o_show.show.msg_in_page * o_show.show.page) + o_show.show.msg_in_page  ) ) > key1) ) {
			data.push(value);	
		}
	});
	o_show.show.create_link();
	o_show.show.show_message(data);
  }
}

  o_show.sort = {
	type: "", 
	route: "",
  pre_sort: function(type,route){
	$('#all_comments').html("");
	var newclick;
	$('#link_control>a').find("#arrow").removeClass();
	if ( route == 0 ) { newclick= "o_show.sort.pre_sort('"+type+"','1');"; div = $('#link_sort_'+type).find("#arrow"); div.removeClass("arrow-down").addClass("arrow-up"); }
	if ( route == 1 ) { newclick = "o_show.sort.pre_sort('"+type+"','0');";  div = $('#link_sort_'+type).find("#arrow"); div.removeClass("arrow-up").addClass("arrow-down") }
	$("#link_sort_"+type).attr("onclick" , newclick);
	o_show.sort.sort_my(out1,type,route);
	o_show.show.show_page(o_show.show.page);
	//o_show.show.show_message(o_show.sort.sort_my(out1,type,route));
  },
  sort_my: function(data=out1,type="id",route){
	var data1 =data;
	if ( type=="id" ) {
		data1.sort(function(a, b){
			if  ( route >0 ) {
				return a.id - b.id;
			}else {
				return b.id-a.id;
			}
		});
	}
	else {
		var data1 = data.slice(0);
		data1.sort(function(a,b) {
		  var x = a[type].toLowerCase();
		  var y = b[type].toLowerCase();
		  if ( route > 0 ) {  return x < y ? -1 : x > y ? 1 : 0; }
		  else { return x > y ? -1 : x < y ? 1 : 0; }
		});
	}
	_.forEach(data1, function(value, key1) {
		if (value.tree.length> 0){
			data_t=o_show.sort.sort_my(value.tree,type);
			value.tree = data_t;
		}
	})
	out1=data1;
	return data1;
	
  },

  in_to_tree: function(parent_id,data,data_to){
   var i = _.findKey(data, { 'id': parent_id });
   if (typeof(i) == "undefined" ) {
	_.forEach(data, function(value, key1) {
		if (value.tree.length> 0){
			o_show.sort.in_to_tree(parent_id,value.tree,data_to);
		}
	});
   }
   if ( typeof(i) != "undefined" ) {
	data[i].tree.push(data_to);
   }
	return data;
  },

  create_tree: function(data){
   var out=[];
   _.forEach(data, function(item, key1) {
	item = _.assignIn(item,{ tree: [] });
	if (item.parent_id == 0) {
		out.push(item);
	}else{
		t = o_show.sort.in_to_tree(item.parent_id, out, item);
		out = _.assignIn(out, t);
	}
    });
   return out;
  }

}


$.ajax({
      type: 'post',
      url: 'http://kolesnikdenis.com/work1/index/show_json',
      dataType: 'json',
      success: function(data) {
	t=o_show.sort.create_tree(data);
	out1=t;
	o_show.show.create_link();
	//o_show.show.show_message(o_show.sort.sort_my(t,"id"));
	o_show.sort.sort_my(t,"id");
	o_show.show.show_page(0);
      }
});
