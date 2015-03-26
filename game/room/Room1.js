
function Room1(){
	
	var parent = Room.prototype;	
	
	if(typeof Room1.initialized == "undefined"){
		
		Room1.prototype.init = function(){
			parent.add.call(this,new Player());
			parent.add.call(this,new Player());
		}
		
		Room1.prototype.render = function(){
			
			canvasContext2d.drawImage(elementCanvas,0,0);
			
			ctx.fillStyle = "black";
			ctx.strokeStyle = "#00FF00";
			ctx.fillRect(0,0,480,480);
			

			
			
		}
		
		
		
		Room1.initialized = true;
	}
	Room.call(this);
}