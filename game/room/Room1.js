
function Room1(){

	var parent = Room.prototype;

	if(typeof Room1.initialized == "undefined"){
		Room1.initialized = true;
	}

	Room.call(this);
}

Room1.prototype = _.extend(Room.prototype, {
    init : function()
    {
        this.add(new Player());
        this.add(new Player());
    },
    render: function()
    {
        canvasContext2d.drawImage(elementCanvas,0,0);

        ctx.fillStyle = "black";
        ctx.strokeStyle = "#00FF00";
        ctx.fillRect(0,0,480,480);
    }
});