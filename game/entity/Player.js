Player.tt = 0;
Player.block = 0;
function Player(){ Entity.call(this);

	this.destroyCount = 0;
	var parent = Entity.prototype;
	var me = this;
	var left=false, right = false, up = false, down = false, pressBar = false;
	var releasePressBar = false;
	var invProject = false;
    var life = 10;
	var projectileTimeReloadCounter = 0, projectileTimeReload = 3;
	var speed = 2.2;
	this.id = 0;
    this.fire = false;
    this.direction = {
        horizontal : 0,
        vertical : 0
    };

	if(typeof Player.initialized == "undefined"){

		Player.prototype.init = function(){

            this.addEventListener("onFire", _.bind(this.onFire, this))

			this.id = Player.block;
			if(this.id == 0){
				var rect =  Matter.Bodies.rectangle(300,50,300,40,{ isStatic: true });
				this.name = "null";
				parent.setBody.call(this, rect);
			}else{
				this.name = "Player";
				var posx=50,posy=150;
				var tri = Matter.Bodies.polygon(posx,posy,3,16,{inertia: Infinity, density: 0.01, frictionAir: 0.5});

				Matter.Body.rotate(tri,3.14/360*2*-30);
				parent.setBody.call(this,tri);
			}

			Player.block++;
		}

		Player.prototype.render = function(room){
			var body = parent.getBody.call(this);
			var pos = body.position;
			body.center = Matter.Vertices.centre(body.vertices);

			if(this.id > 0){

					//Matter.Body.translate(body,{x:speed,y:0});
					body.force.x=(speed/100) * this.direction.horizontal;
					//Matter.Body.translate(body,{x:0,y:speed});
					body.force.y=(speed/100) * this.direction.vertical;

				if(this.fire && projectileTimeReloadCounter >= projectileTimeReload) {

					if(invProject == true){
						Room.prototype.add.call(room,new Projectile(body.center.x - 10,body.center.y - 12,0,-10));
						invProject = false
					}else{
						Room.prototype.add.call(room,new Projectile(body.center.x + 10,body.center.y - 12,0,-10));
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
		}

		Player.prototype.collisionStart = function(entity){
			//parent.destroy.call(this);
		}

        Player.prototype.move = function(direction, speed)
        {
            this.direction = direction;

            if(typeof speed != "undefined")
            {
                this.speed = speed;
            }
        };

        Player.prototype.fired = function()
        {
            this.fire = true;

            this.notify("onFire");
        };

        Player.prototype.onFire = function()
        {
            console.log("onfire");
        };

		Player.initialized = true;
	}

    window.setInterval(_.bind(function()
    {
        SkelzEngine.getController().update(this);
    }, this), 250);


}

_.extend(Player.prototype, Entity.prototype);