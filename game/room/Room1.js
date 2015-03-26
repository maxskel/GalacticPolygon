var monsterCount = 0;
var parent = Room.prototype;
function Room1(){
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
    },
    render: function()
    {
        canvasContext2d.drawImage(elementCanvas,0,0);

        ctx.fillStyle = "black";
        ctx.strokeStyle = "#00FF00";
        ctx.fillRect(0,0,300,300);




        if(monsterCount >= 30){
            parent.add.call(this,new Monster());
            monsterCount = 0;
        }

        monsterCount++;
    }
});