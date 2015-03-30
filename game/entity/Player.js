function Player() { Entity.call(this);
	
	this.destroyCount = 0;
	var parent = Entity.prototype;
	var me = this;
	var left=false, right = false, up = false, down = false, pressBar = false;
	var releasePressBar = false;
	var invProject = false;
	var projectileTimeReloadCounter = 0, projectileTimeReload = 2;
	var speed = 1;
	this.id = 0;
	
	if(typeof Player.initialized == "undefined"){
		
		Player.prototype.init = function(room){
				this.name = "Player";
				Global.playerHealth = 100;
				
				var posx=250/2,posy=230;
				var tri = Matter.Bodies.polygon(posx,posy,3,12,{inertia: Infinity, density: 0.01, frictionAir: 0.5});
				
				Matter.Body.rotate(tri,3.14/360*2*-30);
				parent.setBody.call(this,tri);	
		};
		
		Player.prototype.render = function(room){
			var body = parent.getBody.call(this);
			var pos = body.position;
			body.center = Matter.Vertices.centre(body.vertices);
			
			if(this.id >= 0){
				
				if(right === true){
					//Matter.Body.translate(body,{x:speed,y:0});
					body.force.x=speed/100;
				}
				
				if(left === true){
					//Matter.Body.translate(body,{x:-speed,y:0});
					body.force.x=-speed/100;
				}
				
				if(down === true){
					//Matter.Body.translate(body,{x:0,y:speed});
					body.force.y=speed/100;
				}
				
				if(up === true){
					//Matter.Body.translate(body,{x:0,y:-speed});
					body.force.y=-speed/100;
				}
				
				if(pressBar === true && projectileTimeReloadCounter >= projectileTimeReload && releasePressBar === true){
					
					if(invProject === true){
						Room.prototype.add.call(room,new Projectile(body.center.x - 2,body.center.y - 10,0,-5));
						invProject = false;
						
					}else{
						Room.prototype.add.call(room,new Projectile(body.center.x + 2,body.center.y - 10,0,-5));
						invProject = true;
					}
					
					projectileTimeReloadCounter = 0;
					releasePressBar = false;
				}
				
				projectileTimeReloadCounter++;
			}
			SkelzEngine.debugDraw(ctx,body);
			
			//MORT DU JOUEUR
			if(Global.playerHealth <= 0){
				parent.destroy.call(this);
				
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
				
				Global.playerLives --;
				Room.prototype.add.call(room, new Player());
			}
		};
		
		Player.prototype.collisionStart = function(entity){
			if(entity.name == "Eclat"){
				Global.playerHealth -= 0.5;
			}
			
			if(entity.name == "Monster"){
				Global.playerHealth -= 20;
			}

		};
		
		window.addEventListener("keydown",function(event){
			var body = parent.getBody.call(me);
			//console.log(event.keyCode);
			
			//Right
			if(event.keyCode == 39){
				right = true;
			}
			
			//left
			if(event.keyCode == 37){
				left = true;
			}
			
			//up
			if(event.keyCode == 38){
				up = true;
			}
			
			//down
			if(event.keyCode == 40){
				down = true;
			}
			
			//pressBar
			if(event.keyCode == 32){
				pressBar = true;
			}
		});
		
		window.addEventListener("keyup",function(event){
			var body = parent.getBody.call(me);
			
			//Right
			if(event.keyCode == 39){
				right = false;
			}
			
			//left
			if(event.keyCode == 37){
				left = false;
			}
			
			//up
			if(event.keyCode == 38){
				up = false;
			}
			
			//down
			if(event.keyCode == 40){
				down = false;
			}
			
			//pressBar
			if(event.keyCode == 32){
				pressBar = false;
				releasePressBar = true;
			}

		});
		
		Player.initialized = true;
	}
	
	
}