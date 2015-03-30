function GameHud(){ Entity.call(this);

	if(GameHud.initialized === undefined){
		
		GameHud.prototype.init = function(){
			
		};
		
		GameHud.prototype.render = function(){
			ctx.fillStyle = "red";
			ctx.fillRect(0,0,256,30);
		};
		
		GameHud.initialized = true;
	}
}