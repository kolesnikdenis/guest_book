function valid_email(mail){
	var reg= /(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/gm;
	return reg.exec(mail) != null;
}

function valid_close_tag(str){
  var test_easy_tag = /(<(strong|i|code)>)(.*?[^\r]?)<(\/((strong|i|code)(.*?)))(>)/gim
  str = str.replace(test_easy_tag,"");
  var test_link_tag=/(<a.*?>)(([^\n].*?)|(.*?[^\n].*?)|([^\n].*?))(<\/a>)/gim
  str = str.replace(test_link_tag,"");
  var del_br_tag = /(<\/br>)/gim
  str = str.replace(del_br_tag,"");



  if ( ( str.indexOf("<") > 0) || (str.indexOf(">") > 0) ) {
    msg= "присудствуют не разрешенные теги или не закрытые теги<br>проверь текст и попробуй снова";
    //document.getElementById("textout").innerHTML = msg;
    alert(msg);
    return false;
  }

}

function validation_link(str){
  regexp=/(<a\s.*href\s?=\s?["'](\bmailto:\b|\bhttp:\/\/\b|\bhttps:\/\/\b).*["'].*?>)(.*?)(<\/a>)/ig;
  out="";
        while (result = regexp.exec(str)) {
          out = result[1].toLowerCase()+result[3].replace("<", "[").replace(">","]")+result[4].toLowerCase();
        }
        return out;
}

function  strip_tags(str, allowed_tags) {
              var key = '', allowed = false;
              var matches = [];
              var allowed_array = [];
              var allowed_tag = '';
              var i = 0;
              var k = '';
              var html = '';

              var replacer = function(search, replace, str) {
                  return str.split(search).join(replace);
              };

              if (allowed_tags) {
                  allowed_array = allowed_tags.match(/([a-zA-Z]+)/gi);
              }

              str += '';

              matches = str.match(/(<\/?[\S][^>]*>)/gi);

              for (key in matches) {
                  if (isNaN(key)) {
                      continue;
                  }
                  html = matches[key].toString();
                  allowed = false;
                  for (k in allowed_array) {
                      allowed_tag = allowed_array[k];
                      i = -1;

                      if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+'>');}
                      if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+' ');}
                      if (i != 0) { i = html.toLowerCase().indexOf('</'+allowed_tag)   ;}
                      if (i == 0) {
                          allowed = true;
                          break;
                      }
                  }

                  if (!allowed) {
                      str = replacer(html, html.replace(/</g, "[").replace(/>/g,"]"), str);
                  }
              }

              return str;
          }

function check_input_tag(str){
  var regexp = /(<(\/*?)(?!(i|a|code|br|strong))\w+?>)/gim
  var link =  /<a.*?>*?<\/a>/gim
  var result,result1;
  var text="";
  var lastindex=0;
  str=str.replace(/\n/g, "</br>\n"); // insert br 
  str= strip_tags(str,"a i strong code br");
  
  while (result1 = link.exec(str)  ) {
	return_link  = validation_link( result1[0]);
	if (return_link == "")  {
	 str = str.substr(0,result1.index) + result1[0].replace(/</g, "[").replace(/>/g,"]") + str.substr(link.lastIndex,(str.length-link.lastIndex)); }
	else {
	 str = str.substr(0,result1.index) + return_link + str.substr(link.lastIndex,(str.length-link.lastIndex));
	}
  }
  if ( valid_close_tag(str) ==false ) {
    return false;
  }
  while (result = regexp.exec(str)) {
        text += str.substr(lastindex,(result.index-lastindex)) + result[0].replace("<", "[").replace(">","]");
        lastindex = regexp.lastIndex;
  }
  if (lastindex < str.length) { text += str.substr(lastindex,(str.length-lastindex)); }

  return text;
}



