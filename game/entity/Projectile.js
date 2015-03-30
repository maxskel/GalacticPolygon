function Projectile(number_x,number_y, speedX, speedY){ 
	Entity.call(this);
	var parent = Entity.prototype;
	this.x=number_x;
	this.y=number_y;
	this.speedX = speedX;
	this.speedY = speedY;
	this.roomInst = undefined;
	
	if(typeof Projectile.initialized == "undefined"){
		Projectile.prototype.init = function(room){
			this.name = "Projectile";
			roomInst = room;
			parent.setBody.call(this,Matter.Bodies.rectangle(this.x,this.y,3,10,{inertia: Infinity}));
		};
		
		Projectile.prototype.render = function(room){
			var body = parent.getBody.call(this);
			
			SkelzEngine.debugDraw(ctx,body);
			
			body.force.y = this.speedY/100000;
			body.force.x = this.speedX/100000;
			
			Matter.Body.translate(body,{x:this.speedX,y:this.speedY});
			
			
		};
		
		Projectile.prototype.collisionActive = function(entity){
			if(entity !== undefined && entity.name != "Player" && entity.name != "Eclat"){
				var body = Entity.prototype.getBody.call(this);

				for(var i=0; i < 2; i++){
					Room.prototype.add.call(roomInst, new Eclat(body.position.x,body.position.y));
				}
				
				this.roomInst = null;
				parent.destroy.call(this);

				
			}
				
		};
		
		Projectile.initialized = true;
	}
		
		
	
	
}