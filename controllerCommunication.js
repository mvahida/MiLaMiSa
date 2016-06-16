		//Group name for development use
				
		var GROUP_NAME = "lars";
				
		var SERVER_ADDRESS = {host: "spaceify.net", port: 1979};
		var WEBRTC_CONFIG = {"iceServers":[{url:"stun:kandela.tv"},{url :"turn:kandela.tv", username:"webrtcuser", credential:"jeejeejee"}]};
		var points = 0;
		var items = [];
		var imageOffSetX = 300;
		var imageOffSetY = 40;
		function TestController()
			{
			var self = this;
			
			var gameClient = null;
			
			self.connect = function()
				{
				gameClient = new GameClient(); 
				gameClient.setScreenConnectionTypeListener(self, self.onScreenConnectionTypeUpdated);
				gameClient.setScreenConnectionListener(self, self.onScreenConnected);
				gameClient.setScreenDisconnectionListener(self, self.onScreenDisconnected);


				
				//Development connection
				gameClient.connect(SERVER_ADDRESS.host, SERVER_ADDRESS.port, "controller", GROUP_NAME, function(){});
				
				//Production connection
				//gameClient.connectAsController(function(){});	
				};
			
			
			self.onScreenConnected = function(id){
				console.log("htmlPhone::onScreenConnected()"+id);
				self.screenId = id;
				gameClient.exposeRpcMethod("getTask", self, self.setTask);
				gameClient.exposeRpcMethod("updatePoints",self, self.updatePoints);
				gameClient.exposeRpcMethod("updateItems",self, self.updateItems);
				gameClient.exposeRpcMethod("updateInformation",self, self.updateInformation);
				
				self.getTask();
				
			};
			
			//Gets the current task for the player from the screen
			self.setTask = function(taskString){
				console.log("New Task"+ taskString)
				document.getElementById("task").innerHTML = taskString;
			};
			

			self.sendButtonPress = function(direction)
				{
				console.log("TestController::sendButtonPress()");
				gameClient.notifyScreens("onButtonPressed",[direction]);
				};
				
			self.getTask = function()
				{
					console.log("getTask");
					gameClient.notifyScreens("onButtonPressed","top");
				};				
			self.updatePoints = function(param){
				
				if (param != null){
					console.log("controllerCommunication::updatePoints"+ param)
					points = points + param;
					document.getElementById("points").innerHTML = points;
				}
				//document.getElementById("task").innerHTML = taskString;

				};

			self.updateItems = function(param){
				console.log("controllerCommunication::updateItems "+ param)
				if (param != null){
					console.log("controllerCommunication::updateItems "+ param)
					//items.push(param);
					var bCanvas = document.getElementById('bCanvas');
					var bcontext = bCanvas.getContext('2d');
					var imageObj = new Image();

					imageObj.onload = function() {
						bcontext.drawImage(this, imageOffSetX, imageOffSetY, 40, 40);
					};
					
					imageObj.src = param;
					imageOffSetX=imageOffSetX-40;
					if (imageOffSetX < 0){
						imageOffSetX = 300;
						imageOffSetY = imageOffSetY + 40;
					}

				}
				//document.getElementById("task").innerHTML = taskString;
				};	
				
			self.updateInformation = function(param){
				console.log("controllerCommunication::updateInformation	"+ param)
				document.getElementById("message").innerHTML = param;
				};
				
			self.onScreenConnectionTypeUpdated = function(newConnectionType, screenId)
				{
				console.log("TestController::onScreenConnectionTypeUpdated() new connection type: " + newConnectionType);
				//document.getElementById("conntype").innerHTML = newConnectionType;
				};
			}
		
		var controller = null; 
			
		window.onload = function()
			{
			controller = new TestController();
			controller.connect();
			}
