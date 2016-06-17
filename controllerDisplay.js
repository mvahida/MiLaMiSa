
	  var bCanvas = document.getElementById('bCanvas');
      var bcontext = bCanvas.getContext('2d');

	  bcontext.font = "20px Arial";
	  bcontext.fillText("Collected Items:",150,20);
	  bcontext.closePath();
      bcontext.lineWidth = 5;
      bcontext.fillStyle = 'red';
      //context.fill();
      bcontext.strokeStyle = '#550000';
      bcontext.stroke();
	  
	  var startx = 100;
	  var starty = 100
      var cCanvas = document.getElementById('cCanvas');
      var context = cCanvas.getContext('2d');

	  
      //context.beginPath();
      context.arc(startx, starty, 70, (Math.PI / 180) * 45, (Math.PI / 180) * 135, false);
	  context.moveTo(startx, starty);
	  context.lineTo(startx+50,starty+50);
	  context.moveTo(startx, starty);
	  context.lineTo(startx-50,starty+50);
	  
	  
	  context.arc(startx, starty, 70, (Math.PI / 180) * 135, (Math.PI / 180) * 225, false);
	  context.moveTo(startx, starty);
	  context.lineTo(startx-50,starty-50);
	  context.moveTo(startx, starty);

	  
	  context.arc(startx, starty, 70, (Math.PI / 180) * 225, (Math.PI / 180) * 315, false);
	  context.moveTo(startx, starty);
	  context.lineTo(startx-50,starty-50);
	  context.moveTo(startx, starty);
	  
	  
	  context.arc(startx, starty, 70, (Math.PI / 180) * 315, (Math.PI / 180) * 405, false);
	  context.moveTo(startx, starty);
	  context.lineTo(startx-50,starty-50);
	  context.moveTo(startx, starty);

	  
      context.closePath();
      context.lineWidth = 5;
      context.fillStyle = 'red';
      //context.fill();
      context.strokeStyle = '#550000';
      context.stroke();
	  console.log("message");
	        function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
	 // controller.sendButtonPress("top");
	  cCanvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(cCanvas, evt);
		if(mousePos.x<70 && mousePos.y > 50 && mousePos.y < 150){		
			controller.sendButtonPress("left");
		}
		if(mousePos.x > 110 && mousePos.y > 50 && mousePos.y < 150){
			console.log("Right");
			controller.sendButtonPress("right");
		}
		if(mousePos.x > 75 && mousePos.y < 100 && mousePos.x < 120){
			controller.sendButtonPress("up");
			console.log("Top");
		}
		if(mousePos.x > 75 && mousePos.y > 100 && mousePos.x < 120){
			controller.sendButtonPress("down");
			console.log("Down");
		}
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);
      }, false);