function Eclat(posX, posY, boolean_inverseDirection){
	Entity.call(this);
	this.parent = Entity.prototype;
	this.x=posX;
	this.y=posY;
	this.boolInv = boolean_inverseDirection;

	this.deathCount = 180;

	if( typeof Eclat.initialized == "undefined"){

		Eclat.prototype.init = function(room){
			this.name = "Eclat";
			var w=Math.random()*5+2;
			var h=Math.random()*5+2;
			var randomX=Math.random()*10,randomY=Math.random()*10;

			this.parent.setBody.call(this,Matter.Bodies.rectangle(this.x+randomX,this.y+randomY,w,h,{frictionAir: 0}));

			var body = this.parent.getBody.call(this);

			var bodies = [body];
			var inv = 1;
			var puissance = Math.random()*15+5;
			var puissanceX = Math.random()*10;

			if(Math.random()*10 < 5){
				inv = -1;
			}

			if(this.boolInv === false)
				Matter.Body.applyGravityAll(bodies,{x:puissanceX*inv,y:puissance});
			else if(this.boolInv === true){
				Matter.Body.applyGravityAll(bodies,{x:puissanceX*inv,y:puissance*-1});
			}else{
				Matter.Body.applyGravityAll(bodies,{x:puissanceX*inv,y:puissance});
			}

		};

		Eclat.prototype.render = function(room){
			var body = this.parent.getBody.call(this);


			//SkelzEngine.debugDraw(ctx,body);

			if(this.deathCount <= 0){
				this.parent.destroy.call(this);
			}

			this.deathCount--;
		};


		Eclat.initialized = true;
	}

}

_.extend(Eclat.prototype, Entity.prototype);
