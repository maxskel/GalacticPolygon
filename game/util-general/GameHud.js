function GameHud(){

	if(GameHud.initialized === undefined){

		GameHud.prototype.render = function(){
            if(typeof canvasContext2d != "undefined")
            {
                canvasContext2d.font = '10px monospace';

                canvasContext2d.fillStyle = "#383838";
                canvasContext2d.fillRect(0,0,256,16);

                canvasContext2d.fillStyle = "white";
                canvasContext2d.fillText("Health:"+Global.playerHealth,5,12);
                canvasContext2d.fillText("|Lives:"+Global.playerLives,70,12);
                canvasContext2d.fillText("|Level:"+Global.level,125,12);
                canvasContext2d.fillText("|score:"+Global.score,180,12);
            }
		};

		GameHud.initialized = true;
	}
}