var monsterCount = 0;
var parent = Room.prototype;
function Room1(){
	var parent = Room.prototype;
	var monsterCount = 0;
	this.gameHud;

	if(typeof Room1.initialized == "undefined"){
		Room1.initialized = true;
	}

	Room.call(this);
}

Room1.prototype = _.extend(Room.prototype, {
    init : function()
    {
        this.add(new Player());
        this.add(new Monster());
        this.gameHub = new GameHud();
    },
    render: function()
    {
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
    }
});
