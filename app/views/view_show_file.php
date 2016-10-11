<center> <h1>Просмотр файла</h1>
<a href="<?php echo conf_home_dir;?>">возврат к комментариям</a><br>
<?php echo "тип файла:".$data[0]."<br>"; 
if ($data[0] !="txt") { echo " Сам файл:<br>".$data[1];} ?>
<style>
          html,body{
              margin: 0;
              padding: 0;
              overflow: hidden;
          }

</style>
<script>
     var canvas = document.createElement('canvas'),
       height = canvas.height = window.innerHeight,
       width = canvas.width = window.innerWidth,
       ctx = canvas.getContext('2d'),
       centerX = width / 2,
       centerY = height / 2,
       offset = height * .4,
       angle = 0,
       speed = 0.02,
       radius = 200,
       noofobj = 300,
       objs = [],
       x, y;

if ("<?php echo $data[0];?>"=="txt"){
     document.body.appendChild(canvas);
var text="<?php echo$data[1];?>";
     lineHeight = 16; //межстроковое
     linewidth=500; // шерина текста

     all_text_height = ctx.measureText(text).width/linewidth*lineHeight+lineHeight;
     marginTop=height/2-(all_text_height/2);
     marginLeft=width/2-((linewidth+50)/2);

     for (var i = 0; i < noofobj; i++) {
       var obj = {};
       obj.startangle = Math.PI * 2 / noofobj * i;
       obj.x = Math.random(0, width) * width;
       obj.y = Math.random(0, height) * height;
       obj.radius = Math.random(20, 50) * 5;
       //console.log(obj);
       objs.push(obj);
     }

     render();
}

        function show_text(x,y,lineHeight,linewidth){

                var words = text.split(" ");
                var countWords = words.length;

                var line = "";
                for (var n = 0; n < countWords; n++) {
                    var testLine = line + words[n] + " ";
                    var testWidth = ctx.measureText(testLine).width;
                    if (testWidth >=linewidth) {
                        ctx.fillStyle = '#00ff00';
                        ctx.fillText(line, x,y );
                        line = words[n] + " ";
                        y += lineHeight;
                   }
                   else {
                        line = testLine;
                   }
                }
                ctx.fillText(line, x,y);;
        }
     function render() {
       ctx.fillStyle = '#000000';
       ctx.fillRect(0, 0, width, height);

       for (var i = 0; i < objs.length; i++) {
         ctx.beginPath();
         ctx.fillStyle = '#0fe';
         radius = Math.random(50, 200) * 2;
         x = objs[i].x + radius * Math.cos(objs[i].startangle + angle);
         y = objs[i].y + radius * Math.sin(objs[i].startangle + angle);
        ctx.arc(x, y, objs[i].radius, 0, Math.PI * 2);
        ctx.fill();



       }

       requestAnimationFrame(render);
       angle += speed;
       show_text(marginLeft,marginTop,lineHeight,linewidth);


     }

</script>
