function GameHud(){

	if(GameHud.initialized === undefined){
		
		GameHud.prototype.render = function(){
			ctx.font = '10px monospace';
			
			ctx.fillStyle = "#383838";
			ctx.fillRect(0,0,256,16);
			
			ctx.fillStyle = "white";
			ctx.fillText("Health:"+Global.playerHealth,5,12);
			ctx.fillText("|Lives:"+Global.playerLives,70,12);
			ctx.fillText("|Level:"+Global.level,125,12);
			ctx.fillText("|score:"+Global.score,180,12);

		};
		
		GameHud.initialized = true;
	}
}