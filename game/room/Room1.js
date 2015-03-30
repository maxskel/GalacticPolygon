
function Room1(){
	Room.call(this);
	var parent = Room.prototype;	
	var monsterCount = 0;
	this.gameHud;
	
	if(typeof Room1.initialized == "undefined"){
		
		Room1.prototype.init = function(){
			//parent.add.call(this,new Player());
			parent.add.call(this,new Player());
			parent.add.call(this,new Monster());
			this.gameHub = new GameHud();
		};
		
		Room1.prototype.render = function(){
			
			if(monsterCount >= 30){
				parent.add.call(this,new Monster());
				monsterCount = 0;
			}
			
			GameHud.prototype.render.call(this.gameHud);
			canvasContext2d.drawImage(elementCanvas,0,0);
			
			ctx.fillStyle = "black";
			ctx.strokeStyle = "#00FF00";
			ctx.fillRect(0,0,300,300);
			
			monsterCount++;
		};
		
		
		
		Room1.initialized = true;
	}
	
}