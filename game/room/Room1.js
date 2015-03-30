
function Room1(){
	Room.call(this);
	var parent = Room.prototype;	
	var monsterCount = 0;
	
	if(typeof Room1.initialized == "undefined"){
		
		Room1.prototype.init = function(){
			//parent.add.call(this,new Player());
			parent.add.call(this,new Player());
			parent.add.call(this,new Monster());
		};
		
		Room1.prototype.render = function(){

			canvasContext2d.drawImage(elementCanvas,0,0);
			
			ctx.fillStyle = "black";
			ctx.strokeStyle = "#00FF00";
			ctx.fillRect(0,0,300,300);

			
			
			
			if(monsterCount >= 30){
				parent.add.call(this,new Monster());
				monsterCount = 0;
			}
			
			monsterCount++;
		};
		
		
		
		Room1.initialized = true;
	}
	
}