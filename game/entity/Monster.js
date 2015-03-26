function Monster() {

	var parent = Entity.prototype;
	this.vie = 100;
	this.shoot = false;

	if(Monster.initialized === undefined){

		Monster.prototype.init = function(room){

			this.name = "Monster";
			var posx=60+Math.random()*190,posy=-80;

			var tri = Matter.Bodies.polygon(posx,posy,3,10+Math.random()*10,{density: 0.01});
			Matter.Body.rotate(tri,3.14/360*2*30);

			if(Math.random()*10 > 5){
				tri = Matter.Bodies.rectangle(posx,posy, 10+Math.random()*20,10+Math.random()*20,{ density: 0.01});
				Matter.Body.rotate(tri,3.14/360*2*45*Math.random()*360);
			}

			parent.setBody.call(this,tri);

		};

		Monster.prototype.render = function(room){
			var body = parent.getBody.call(this);
			var pos = body.position;
			body.center = Matter.Vertices.centre(body.vertices);

			var bodies = [body];
			Matter.Body.applyGravityAll(bodies,{x:0,y:0.06});
			/*if(this.shoot === true){
				Room.prototype.add.call(room,new Projectile(10,10,0,5));
				this.shoot = false;
			}*/
			//Matter.Body.translate(body,{x:-1, y:0});

			SkelzEngine.debugDraw(ctx,body);

			if(this.vie <= 0){
				var bool = false;
				for(var i=0; i < 10; i++){
					if(bool === true){
						Room.prototype.add.call(room,new Eclat((pos.x-5)+Math.random()*10,pos.y));
						bool = false;
					}else{
						Room.prototype.add.call(room,new Eclat( (pos.x-5)+Math.random()*10,pos.y,true));
						bool = true
					}
				}
				Global.score+=1;
				parent.destroy.call(this);
			}

		};

		Monster.prototype.collisionStart = function(entity){
			if(entity.name == "Projectile"){
				this.vie -= 25;
			}
		};


		Monster.initialized = true;
	}

	Entity.call(this);
}

_.extend(Monster.prototype, Entity.prototype);
