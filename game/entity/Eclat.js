function Eclat(number_x,number_y){ 
	Entity.call(this);
	this.parent = Entity.prototype;
	this.x=number_x;
	this.y=number_y;
	
	this.deathCount = 120;
	
	if( typeof Eclat.initialized == "undefined"){
		
		Eclat.prototype.init = function(room){
			this.name = "Eclat";
			var w=Math.random()*4+1,h=Math.random()*4+1;
			var randomX=Math.random()*10,randomY=Math.random()*10;
			
			this.parent.setBody.call(this,Matter.Bodies.rectangle(this.x+randomX,this.y+randomY,w,h,{frictionAir: 0}));
			
			var body = this.parent.getBody.call(this);
			
			var bodies = [body];
			var inv = 1;
			var puissance = Math.random()*15+10;
			var puissanceX = Math.random()*4;
			
			if(Math.random()*10 < 5){
				inv = -1;
			}
			
			Matter.Body.applyGravityAll(bodies,{x:puissanceX*inv,y:puissance});
		}
		
		Eclat.prototype.render = function(room){
			var body = this.parent.getBody.call(this);
			
			
			SkelzEngine.debugDraw(ctx,body);
			
			if(this.deathCount <= 0){
				this.parent.destroy.call(this);
			}
			
			this.deathCount--;
		}

		
		Eclat.initialized = true;
	}
		
		
		
		
	
	
}