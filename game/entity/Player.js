Player.tt = 0;
Player.block = 0;

function Player() {
    Entity.call(this);
	this.destroyCount = 0;
	var parent = Entity.prototype;
	var me = this;
	var left=false, right = false, up = false, down = false, pressBar = false;
	var releasePressBar = false;
	var invProject = false;
	var projectileTimeReloadCounter = 0, projectileTimeReload = 2;
	this.speed = 1;
    var life = 10;

	this.id = 0;
    this.fire = false;
    this.direction = {
        horizontal : 0,
        vertical : 0
    };

	if(typeof Player.initialized == "undefined"){

		Player.prototype.init = function(room){

//            Matter.Events.on(SkelzEngine.engine, "tick", _.bind(this.render, this));

            this.addEventListener("onFire", _.bind(this.onFire, this))
            //this.addEventListener("onDestroy", _.bind(this.onDestroy, this));
			this.id = Player.block;
			//if(this.id === 0){
				//var rect =  Matter.Bodies.rectangle(400,0,800,90,{ isStatic: true });
				//this.name = "null";
				//parent.setBody.call(this, rect);
			//}else{
				this.name = "Player";
                Global.playerHealth = 100;

                var posx=250/2,posy=230;
				var tri = Matter.Bodies.polygon(posx,posy,3,12,{
                    inertia: Infinity,
                    density: 0.01,
                    frictionAir: 0.5,
                    render: {
                        fillStyle: 'red',
                        strokeStyle: 'blue',
                        lineWidth: 3
                    }
                });

				Matter.Body.rotate(tri,3.14/360*2*-30);
				parent.setBody.call(this,tri);

			Player.block++;
		};

        Player.prototype.prerender = function(room)
        {
            if(this.priv_destroyCalled)
            {
                if(room.hasEventDispatcher())
                {
                    room.getEventDispatcher().notify("dead");
                }
            }
        };

		Player.prototype.render = function(room){
			var body = parent.getBody.call(this);
			var pos = body.position;
			body.center = Matter.Vertices.centre(body.vertices);
            ctx.fillStyle = "#00FF00";
            ctx.fillText("Scrore:"+Global.score,200,10);

					//Matter.Body.translate(body,{x:speed,y:0});
					body.force.x=(this.speed/100) * this.direction.horizontal;
					//Matter.Body.translate(body,{x:0,y:speed});
					body.force.y=(this.speed/100) * this.direction.vertical;

				if(this.fire && projectileTimeReloadCounter >= projectileTimeReload) {

					if(invProject == true){
						Room.prototype.add.call(room,new Projectile(body.center.x - 10,body.center.y - 12,0,-10));
						invProject = false
					}else{
						Room.prototype.add.call(room,new Projectile(body.center.x + 2,body.center.y - 10,0,-5));
						invProject = true;
					}

					projectileTimeReloadCounter = 0;
					releasePressBar = false;
				}

				projectileTimeReloadCounter++;

           // Matter.Render.bodies(SkelzEngine.engine, [body], ctx);
			//SkelzEngine.debugDraw(ctx,body);

			//if(this.id > 0)
			//Matter.Body.rotate(body,3.14/360*2*Player.tt);

			//Matter.Body.rotate(body,0.08);
			Player.tt++;

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
            }
		}

        Player.prototype.onDestroy = function()
        {
            console.log("onDestroy");
        };

		Player.prototype.collisionStart = function(entity) {
            if (entity.name == "Eclat") {
                Global.playerHealth -= 0.5;
            }

            if (entity.name == "Monster") {
                Global.playerHealth -= 20;
            }
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
    }, this), 100);


}

_.extend(Player.prototype, Entity.prototype);
