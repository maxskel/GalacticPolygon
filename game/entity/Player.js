Player.tt = 0;
Player.block = 0;
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
			this.id = Player.block;
			//if(this.id === 0){
				//var rect =  Matter.Bodies.rectangle(400,0,800,90,{ isStatic: true });
				//this.name = "null";
				//parent.setBody.call(this, rect);
			//}else{
				this.name = "Player";
				var posx=50,posy=150;
				var tri = Matter.Bodies.polygon(posx,posy,3,12,{inertia: Infinity, density: 0.01, frictionAir: 0.5});
				
				Matter.Body.rotate(tri,3.14/360*2*-30);
				parent.setBody.call(this,tri);	
			//}
			
			
			
			Player.block++;
		};
		
		Player.prototype.render = function(room){
			var body = parent.getBody.call(this);
			var pos = body.position;
			body.center = Matter.Vertices.centre(body.vertices);
			ctx.fillStyle = "#00FF00";
			ctx.fillText("Scrore:"+Global.score,200,10);
			
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
			
			//if(this.id > 0)
			//Matter.Body.rotate(body,3.14/360*2*Player.tt);
		
			//Matter.Body.rotate(body,0.08);
			Player.tt++;
		};
		
		Player.prototype.collisionStart = function(entity){
			//parent.destroy.call(this);

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