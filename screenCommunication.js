			
		//Group name for development use
				
		var GROUP_NAME = "lars";
		
		var SERVER_ADDRESS = {host: "spaceify.net", port: 1979};
		var WEBRTC_CONFIG = {"iceServers":[{url:"stun:kandela.tv"},{url :"turn:kandela.tv", username:"webrtcuser", credential:"jeejeejee"}]};
		var TARGETS = [{posX: 23, posY: 23, task: "Go to the library and get a book.", image: 'http://192.168.1.203/1465925339_si-duo-t-shirt.png' , points: 2} ]	
			
		function getRandomInt(max) {
			return Math.floor(Math.random() * max) + 1;
		}
		
		function TestScreen()
			{
			var self = this;
			var players = {};
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
			
			//ToDO Correct moving function
			movePlayer = function(callerId, direction){
				players[callerId].posX=players[callerId].posX+1;
				players[callerId].posY=players[callerId].posY+1;
			};
			
			//ToDO Correct moving function
			targetReached = function(callerId)
			{
				if (TARGETS[players[callerId].taskId].posX == players[callerId].posX && TARGETS[players[callerId].taskId].posY == players[callerId].posY){
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
				players[callerId] = {posX: 0, posY: 0, points:0, stepsToTarget:0 taskId:getRandomInt(TARGETS.length)-1};
				console.log("onControllerConnected::" + players[callerId].posX);
				gameClient.notifyController(callerId, "setTask",["Task: Collect a cup of coffee!"]);
				console.log("PLAYERS: " + ObjectSize(players));
				};
			self.onButtonPressed = function(direction, callerId, connectionId, callback)
				{
				buttonPressCounter++;
				console.log("TestSreen::onButtonPressed() direction: "+direction+" callerId: "+callerId+" connectionId: "+connectionId);
				document.getElementById("message").innerHTML = "Button pressed "+ buttonPressCounter + "callerId "+ callerId;
				movePlayer(callerId, direction);
				console.log("targetReached "+ targetReached(callerId));
				players[callerId].stepsToTarget = players[callerId].stepsToTarget+1;
				if (targetReached(callerId) == true){
					players[callerId].points=players[callerId].points + TARGETS[players[callerId].taskId].points;
					gameClient.notifyController(callerId, "updatePoints",[TARGETS[players[callerId].taskId].points]);
					gameClient.notifyController(callerId, "updateItems",[TARGETS[players[callerId].taskId].image]);
					players[callerId].taskId = getRandomInt(TARGETS.length)-1;
					players[callerId].stepsToTarget = 0;
				}
				
				
				//ToDo: Make it work
				gameClient.notifyController(callerId, "getTask",["Task: " + TARGETS[players[callerId].taskId].task]);
				

				gameClient.notifyController(callerId, "updateInformation",[self.informationMessage()]);
				};
		
			self.getTask = function(callerId, connectionId, callback)
				{
					console.log("TestScreen::getTask")
					gameClient.notifyController(callerId, "getTask", ["Task: Collect a cup of coffee!"]);
				};
			self.connect = function()
				{
				gameClient.exposeRpcMethod( "onButtonPressed", self, self.onButtonPressed);			
				gameClient.exposeRpcMethod( "getTask", self, self.selfGetTask);
				gameClient.connect(SERVER_ADDRESS.host, SERVER_ADDRESS.port, "screen", GROUP_NAME, function(){});
				gameClient.setControllerConnectionListener(self, self.onControllerConnected);
				//gameClient.setControllerDisconnectionListener(self, self.onControllerConnected);
				
				// Connect for deployment
				//gameClient.connectAsScreen("phaseroid", document.getElementById("url"), document.getElementById("qr"), function() {});	
				};

			}

		

		var screen = new TestScreen();
			
		window.onload = function()
			{
			screen.connect();
			}
				
