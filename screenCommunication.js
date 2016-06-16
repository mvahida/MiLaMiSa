			
		//Group name for development use
				
		var GROUP_NAME = "lars";
		
		var SERVER_ADDRESS = {host: "spaceify.net", port: 1979};
		var WEBRTC_CONFIG = {"iceServers":[{url:"stun:kandela.tv"},{url :"turn:kandela.tv", username:"webrtcuser", credential:"jeejeejee"}]};
		var TARGETS = [{id: "coffee", posX: 1219, posY: 711, task: "Get a coffee.", image: 'http://192.168.1.203/UBISS/coffee.png' , points: 2}, {id: "ham", posX: 530, posY: 100, task: "Get a hamburger.", image: 'http://192.168.1.203/UBISS/hamburger.png' , points: 2}, {id: "cake", posX: 1549, posY: 323, task: "Get a cake.", image: 'http://192.168.1.203/UBISS/cake.png' , points: 2}]	
		var players = {};	
		
		function getRandomInt(max) {
			return Math.floor(Math.random() * max) + 1;
		}
		
		function showTargets(){
			console.log("showTargets::")
			for (var x in TARGETS){
				document.getElementById(TARGETS[x].id).style.display = 'none';
				console.log("showTargets:: "+TARGETS[x].id)
			}
			for(var x in players){
				console.log("showTargets:: "+ TARGETS[players[x].taskId].posX);
				if (Math.abs(TARGETS[players[x].taskId].posX - path[players[x].currentPath][players[x].currentPosition][0]) < 100
				&&  Math.abs(TARGETS[players[x].taskId].posY - path[players[x].currentPath][players[x].currentPosition][1]) < 100){
					document.getElementById(TARGETS[players[x].taskId].id).style.display = 'initial';
					
				}
			}
		}
		function TestScreen()
			{
			var self = this;

			var gameClient = new GameClient();
			
			//gameClient.setControllerDisconnectionListener(self, self.onControllerDisconnected);
			
			var buttonPressCounter = 0;
			
			ObjectSize = function(obj) {
				var size = 0, key;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) size++;
				}
			return size;
			}
			
			/*//ToDO Correct moving function
			movePlayer = function(callerId, direction){
				players[callerId].posX=players[callerId].posX+1;
				players[callerId].posY=players[callerId].posY+1;
			};*/
			
			//ToDO Correct moving function
			targetReached = function(callerId){
				console.log("targetReached::Target/player x="+TARGETS[players[callerId].taskId].posX+"/" + path[players[callerId].currentPath][players[callerId].currentPosition][0] +" Target y" + TARGETS[players[callerId].taskId].posY + "/"+path[players[callerId].currentPath][players[callerId].currentPosition][1]);
				if (TARGETS[players[callerId].taskId].posX == path[players[callerId].currentPath][players[callerId].currentPosition][0] 
				&&  TARGETS[players[callerId].taskId].posY == path[players[callerId].currentPath][players[callerId].currentPosition][1]){
					return true;
				}
				return false;
			};
			
			self.informationMessage = function(){
				console.log("InfoMSG");
				
				if (ObjectSize(players)>1){
					return 'There is another player around. His player might know, how to solve your task.';
				}
				
			};
			self.onControllerConnected = function (callerId)
				{
				console.log("onControllerConnected::" + callerId);
				players[callerId] = {currentPath: 0, currentPosition: 0, points:0, stepsToTarget:0, taskId:1/*getRandomInt(TARGETS.length)-1*/, timeLastI: (Math.floor(Date.now() / 1000))};
				console.log("onControllerConnected::" + players[callerId].currentPath);
				gameClient.notifyController(callerId, "setTask",["Task: Collect a cup of coffee!"]);
				console.log("PLAYERS: " + ObjectSize(players));
				};
			
			self.cleanPlayers = function(){
				var key;
				for (key in players) {
					if (((Math.floor(Date.now() / 1000)) - players[key].timeLastI) > 20){
						delete players[key];
					};
				}
			};
			self.onButtonPressed = function(direction, callerId, connectionId, callback)
				{
				buttonPressCounter++;
				showTargets();
				//console.log("TestSreen::onButtonPressed() direction: "+direction+" callerId: "+callerId+" connectionId: "+connectionId);
				//document.getElementById("message").innerHTML = "Button pressed "+ buttonPressCounter + "callerId "+ callerId;
				//movePlayer(callerId, direction);
				checkPath(direction, callerId);
				players[callerId].stepsToTarget = players[callerId].stepsToTarget+1;
				if (targetReached(callerId) == true){
					console.log("TargetReached!")
					players[callerId].points=players[callerId].points + TARGETS[players[callerId].taskId].points;
					gameClient.notifyController(callerId, "updatePoints",[TARGETS[players[callerId].taskId].points]);
					gameClient.notifyController(callerId, "updateItems",[TARGETS[players[callerId].taskId].image]);
					document.getElementById(TARGETS[players[callerId].taskId].id).style.display = 'none';
					players[callerId].taskId = getRandomInt(TARGETS.length)-1;
					players[callerId].stepsToTarget = 0;
				}
				
				
				//ToDo: Make it work
				gameClient.notifyController(callerId, "getTask",["Task: " + TARGETS[players[callerId].taskId].task]);
			
				gameClient.notifyController(callerId, "updateInformation",[self.informationMessage()]);
				//self.cleanPlayers();
				};
		
			self.getTask = function(callerId, connectionId, callback)
				{
					//gameClient.notifyController(callerId, "getTask", ["Task: Collect a cup of coffee!"]);
				};
				
			self.onDisontrollerConnected = function(callerId)
				{
					delete players[callerId];
				};
			self.connect = function()
				{
				gameClient.exposeRpcMethod( "onButtonPressed", self, self.onButtonPressed);			
				gameClient.exposeRpcMethod( "getTask", self, self.selfGetTask);
				gameClient.exposeRpcMethod( "controllerClosed", self, self.controllerClosed);
				gameClient.connect(SERVER_ADDRESS.host, SERVER_ADDRESS.port, "screen", GROUP_NAME, function(){});
				gameClient.setControllerConnectionListener(self, self.onControllerConnected);
				gameClient.setControllerDisconnectionListener(self, self.onDisontrollerConnected);
				
				// Connect for deployment
				//gameClient.connectAsScreen("phaseroid", document.getElementById("url"), document.getElementById("qr"), function() {});	
				};

			}

		

		var screen = new TestScreen();
			
		window.onload = function()
			{
			screen.connect();
			}
				
				
				
///MAP////				
	temp = [];
	var body = document.getElementsByTagName("body")[0];
	/*body.addEventListener("click", function(event){
		temp.push([event.clientX,event.clientY]);
		console.log(temp.toString());
	});
	var btn_right = document.getElementById("btn_right");
	btn_right.addEventListener("click", function(){
		checkPath("right");
	});
	var btn_left = document.getElementById("btn_left");
	btn_left.addEventListener("click", function(){
		checkPath("left");
	});
	var btn_up = document.getElementById("btn_up");
	btn_up.addEventListener("click", function(){
		checkPath("up");
	});
	var btn_down = document.getElementById("btn_down");
	btn_down.addEventListener("click", function(){
		checkPath("down");
	});
*/
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var heart = canvas.getContext("2d");
	var line = canvas.getContext("2d");
	var start_x = 534, start_y = 13;
	var path = [[[534,13],[534,39],[530,74],[530,100],[527,133],[529,174],[531,200],[539,223],[545,242],[550,273],[559,305],[569,332],[582,366],[598,389],[608,412],[617,427],[633,456],[654,472],[685,491],[705,508],[730,522],[759,541],[792,562],[826,584],[854,601],[885,619],[908,638],[934,654],[967,645],[1003,626],[1022,620],[1060,616],[1087,632],[1122,647],[1160,672],[1189,691],[1219,711],[1251,729],[1281,751],[1305,775],[1332,793],[1364,809],[1400,827],[1429,838],[1429,838],[1456,834],[1497,850],[1542,853],[1589,857],[1635,852],[1686,851],[1737,841],[1771,834],[1815,826],[1853,824],[1886,820]]
	,[[1225,710],[1245,677],[1269,641],[1289,616],[1317,584],[1330,559],[1347,528],[1367,491],[1386,455],[1402,426],[1421,396],[1439,369],[1450,334],[1476,289],[1498,253],[1514,225],[1532,193],[1549,159],[1566,122],[1587,94],[1602,67],[1612,38],[1621,10]]
	,[[935,668],[914,696],[892,729],[875,760],[855,797],[840,818],[822,845],[804,877],[788,902],[773,926],[761,944]]];

	var steps = 20;
	var step_count = 0;
	mainPath = path[0];

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	/*var imageObj = new Image();

    imageObj.onload = function() {
        ctx.drawImage(imageObj, 0, 0, 1920, 446);
		};
	  
	  
      imageObj.src = 'http://192.168.1.203/ubiss/maporange.png'
	
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#D35400';
*/
	drowCircle(start_x,start_y);
	//drowPath();


	function moveUser( x,  y, path) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drowCircle(start_x + x , start_y + y);
	}

	function moveUserOnMap( x,  y) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drowCircle(x , y);
	}

	function drowCircle(x,y) {
		//drowPath();
		ctx.beginPath();
		ctx.arc(x,y,10,0,Math.PI*2,true); 
		ctx.fillStyle = '#D35400';
		ctx.fill();
		ctx.stroke();
		start_x = x;
		start_y = y;
	}

	// function drowPath() {
	// 	line.lineWidth = 10;
	// 	line.strokeStyle = '#F1C40F';
	// 	line.beginPath();
	// 	// line.moveTo(35, 150);
	// 	for (var i = 0; i < path1.length; i++) {
	// 		line.lineTo(path1[i][0],path1[i][1])
	// 	}
	// 	line.stroke();

	// 	line.lineWidth = 10;
	// 	line.strokeStyle = '#D35400';
	// 	line.beginPath();
	// 	for (var i = 0; i < path2.length; i++) {
	// 		line.lineTo(path2[i][0],path2[i][1])
	// 	}
	// 	line.stroke();

	// }
	var isBackward = false;

	function Node(data) {
		this.data = data;
		this.parent = null;
		this.children = [];
	}

	function Tree(data) {
		var node = new Node(data);
		this._root = node;
	}

	function checkPath(movement, callerId) {
		/*console.log(players[callerId])
		if(path[players[callerId].currentPath][players[callerId].currentPosition][0] == 1219 && path[players[callerId].currentPath][players[callerId].currentPosition][1] == 711){
 			document.getElementById("coffee").style.display = 'none';
		}
		else if(path[players[callerId].currentPath][players[callerId].currentPosition][0] == 1549 && path[players[callerId].currentPath][players[callerId].currentPosition][1] == 159){
			document.getElementById("cake").style.display = 'none';
		}
		else if(path[players[callerId].currentPath][players[callerId].currentPosition][0] == 530 && path[players[callerId].currentPath][players[callerId].currentPosition][1] == 100){
			document.getElementById("ham").style.display = 'none';
		}*/
		if(movement == 'up')
		{
			if(players[callerId].currentPosition != 0){
				players[callerId].currentPosition--;
				moveUserOnMap(path[players[callerId].currentPath][players[callerId].currentPosition][0], path[players[callerId].currentPath][players[callerId].currentPosition][1]);
			}
			else if(players[callerId].currentPath == 2){
				players[callerId].currentPath = 0;
				players[callerId].currentPosition = 27;
			}
		}
		if( movement == 'left')
		{
			if(path[players[callerId].currentPath][players[callerId].currentPosition][0] >= 934 && path[players[callerId].currentPath][players[callerId].currentPosition][1] == 654)
			{
				players[callerId].currentPath = 2;
				players[callerId].currentPosition = 0;
			}
			if(players[callerId].currentPath == 2 && players[callerId].currentPosition < path[players[callerId].currentPath].length)
			{
				players[callerId].currentPosition ++;
				moveUserOnMap(path[players[callerId].currentPath][players[callerId].currentPosition][0],path[players[callerId].currentPath][players[callerId].currentPosition][1]);	
			}
		}
		if( movement == 'down')
		{
			if(players[callerId].currentPath  == 1)
			{
				if(players[callerId].currentPosition != 0){
					players[callerId].currentPosition--;
					moveUserOnMap(path[players[callerId].currentPath][players[callerId].currentPosition][0],path[players[callerId].currentPath][players[callerId].currentPosition][1]);	}
					else{
						players[callerId].currentPath = 0;
						players[callerId].currentPosition = 35;
					}
				}
				else if(players[callerId].currentPosition < path[players[callerId].currentPath].length){
					players[callerId].currentPosition++;
					moveUserOnMap(path[players[callerId].currentPath][players[callerId].currentPosition][0],path[players[callerId].currentPath][players[callerId].currentPosition][1]);	}			
				}
				if( movement == 'right')
				{
					if(path[players[callerId].currentPath][players[callerId].currentPosition][0] == 1189 && path[players[callerId].currentPath][players[callerId].currentPosition][1] == 691)
					{
						players[callerId].currentPath = 1;
						players[callerId].currentPosition = 0;
					}
					if(players[callerId].currentPath == 1 && players[callerId].currentPosition < path[players[callerId].currentPath].length)
					{
						players[callerId].currentPosition++;
						moveUserOnMap(path[players[callerId].currentPath][players[callerId].currentPosition][0],path[players[callerId].currentPath][players[callerId].currentPosition][1]);
					}
				}
			}
