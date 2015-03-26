//SkelzEngine actuel utilise la lib Matter.js 0.8.0
//Voir le code appret cette classe gère les include et la classe principal SkelzEngine
// pour raptogame.com fait par Maxime Wuyts 
// #NOTE#
/** Dev: Les Matter.Body peuve contenir des Entity le membre des Entity est entity (body.entity)
 Tous les méthode et classe ne peuve etre utiliser sans que l'engine soi bien charger.
 Pour être sur que tous est bien charger vous devez commencer a programmer dans le callback de la méthode statique SkelzEngine.init(callback);
*/
 
SkelzEngine.priv_const_maxWorldBounds = 1000; // 2100000000 //Défénie les dimention maximum des mondes World/Room
SkelzEngine.priv_const_setFps_fpsChosenPhys = 20;//Fps du moteur physique de Matter.js SkelzEngine.setFps(fps); pour changer le fps des renders
SkelzEngine.priv_const_globalGravity = {x: 0.0000, y: 0.0000};// Gravité constante des mondes.
SkelzEngine.priv_const_showWarnMsg = true;

/**
* #CLASSE INTERNE# #Internal Class#
* Classe qui permet de charger de facon sécuritaire tous les éléments du moteur de jeux et autre include avant son utilisation.
* 
*/
function SafeInclude(){}
	//Code pour les fonction include et includeReady
	SafeInclude.includeInLoad = 0;
	SafeInclude.fonctionCalledForInclude;
	SafeInclude.intervalCalledForVerification;
	SafeInclude.dejasIncluTab = [];

	
	/**
	* Permet d'inclure des libs javascript en spécifian le chemain du fichier en argument.
	*/
	SafeInclude.include = function(pathName){
		var stopInclude = false;
		
		for(var i=0; i < SafeInclude.dejasIncluTab.length; i++){
			if(SafeInclude.dejasIncluTab[i] == pathName){
				stopInclude = true;
			}
		}
		
		if(stopInclude != true){
			SafeInclude.dejasIncluTab.push(pathName);
			
			SafeInclude.includeInLoad++;
			
			var imported = document.createElement("script");
			imported.src = pathName;
			imported.type = "text/javascript";
			
			imported.onload = function(){
				SafeInclude.includeInLoad--;
			}
			
			document.head.appendChild(imported);
		}
		
	}

	/**
	* Appelle la fonction passer en arguments quand tous les includes son charger.
	*/
	SafeInclude.includeReady = function(functionCalling){
		SafeInclude.fonctionCalledForInclude = functionCalling;
		SafeInclude.intervalCalledForVerification = setInterval(SafeInclude.verificationIncludeReady,50);
	}

	/**
	* Fonction appeller par la gestion des includes.
	*/
	SafeInclude.verificationIncludeReady = function(){
		if(SafeInclude.includeInLoad == 0){
			clearInterval(SafeInclude.intervalCalledForVerification);
			SafeInclude.fonctionCalledForInclude();
			SafeInclude.fonctionCalledForInclude = undefined;
		}
	}
// Fin SafeInclude class

// ENTITY ---------------------------------------------
Entity.oneHitWarning = false;
function Entity(){
	
	this.name=undefined;
	this.priv_newBody = false;// Utile au bon fonctionnement des ajouts de body a la room
	this.priv_body;
	this.priv_destroyCalled = false;
	
	
	if(typeof Entity.initialized == "undefined"){
		
		/**
		* Permet de donné un nom a lentité en question pour la diférencer des autres.
		* le nom est récupérable avec getName();
		*/
		Entity.prototype.setName = function(theEntityName){
			this.name = theEntityName;
		}
		
		/**
		* Récupère le nom donner a lentité via setName(name) ou undefined
		*/
		Entity.prototype.getName = function(){
			return this.name;
		}
		
		/**
		* Permet de configurer un body pour les collisions.
		* Un body peut etre creer grace a la classe Bodies et c'est méthode de la lib Matter.js "Matter.Bodies"
		* Détruie et décharge de la mémoire l'ancien Body avant de configurer le nouveau.
		* @param Body
		*/
		Entity.prototype.setBody = function(body){
			if(this.priv_body != "undefined" && this.priv_body != null){
				Matter.Composite.remove(SkelzEngine.engine.world, this.priv_body, true);
			}
			
			if(body != "undefined" && body != null){
				this.priv_body = body;
				this.priv_body.entity = this;
				this.priv_newBody = true;
				
				
				//Ce mini code corrige un bug "Certain body refuse de tourné si l'angle de départ est 0 ou identique au body rencontrer"
				var angularCorrection = Math.random() / 100;
				Matter.Body.rotate(body,angularCorrection);
			}else{
				this.priv_body = undefined;
				this.priv_newBody = false;
			}
			
			
		}
		
		/**
		* Retourne undefined ou le Body configurer via setBody(Body);
		* @return Body or undefined
		*/
		Entity.prototype.getBody = function(){
			return this.priv_body;
		}
		
		/**
		* Décharge l'entité en mémoire, Suprime l'entité de la room actuel et libèrre la mémoire.
		* Vous ne pouvez plus utiliser une entity apret avoir apeller cette méthode car il ne seras plus valide.
		* vous pouvez vérifier la validiter d'une entity grace a la méthode de l'Entity "isValid();"
		*/
		Entity.prototype.destroy = function(){
			this.priv_destroyCalled = true;
		}
		
		/**
		* Méthode interne.
		* Méthode gèrer par le moteur de jeux. "Classe Room"
		*/
		Entity.prototype.preInit = function(room){
			
			//Capture des erreures lier au méthode essential au Entity
			if(this.render == "undefined" || this.render == null){
				console.error("The Entity class need method render(room)");
				alert("The Entity class need method render(room)");
			}
			
			if(this.init == "undefined" || this.init == null){
				console.error("The Entity class need method init(room)");
				alert("The Entity class need method init(room)");
			}
			
			if(Entity.oneHitWarning == false){
				if(this.collisionStart == "undefined" || this.collisionStart == null){
					if(SkelzEngine.priv_const_showWarnMsg == true)
						console.warn("The Entity class need method collisionStart(Entity_B); for collision.");
				}
				
				if(this.collisionEnd == "undefined" || this.collisionEnd == null){
					if(SkelzEngine.priv_const_showWarnMsg == true)
						console.warn("The Entity class need method collisionEnd(Entity_B); for collision.");
				}
				
				if(this.collisionActive == "undefined" || this.collisionActive == null){
					if(SkelzEngine.priv_const_showWarnMsg == true)
						console.warn("The Entity class need method collisionActive(Entity_B); for collision.");
				}
				
				Entity.oneHitWarning = true;
			}
			

			this.init(room);

			// Detecte si un nouveau body a ete ajouter A metre après lapelle de init
			if(this.priv_newBody == true){
				Matter.World.add(SkelzEngine.engine.world,this.priv_body);
				this.priv_newBody = false;		
			}
			
		}
		
		/**
		* Méthode interne.
		* Méthode gèrer par le moteur de jeux. "Classe Room"
		*/
		Entity.prototype.preRender = function(room){
			//Ajout de code ici
			
			this.render(room);
			
			//Si une Entité ou le body de celle ci dépasse les limite du monde on le détruie automatiquement et on envoi un msg dérreure
			if(this.priv_body != "undefined" && this.priv_body != null){
				
				if(this.priv_body.position.y > SkelzEngine.priv_const_maxWorldBounds || this.priv_body.position.y < SkelzEngine.priv_const_maxWorldBounds*-1  || this.priv_body.position.x > SkelzEngine.priv_const_maxWorldBounds || this.priv_body.position.x < SkelzEngine.priv_const_maxWorldBounds*-1){
					if(SkelzEngine.priv_const_showWarnMsg == true)
						console.warn("The Body/Entity is out of bounds. This Body/Entity has been destroyed by the SkelzEngine. Maximum World Bounds is: X: "+SkelzEngine.priv_const_maxWorldBounds*-1+" Y: "+SkelzEngine.priv_const_maxWorldBounds*-1+" Width: "+SkelzEngine.priv_const_maxWorldBounds+" Height: "+SkelzEngine.priv_const_maxWorldBounds);
					
					Entity.prototype.destroy.call(this);
				}
			}
			
			// Detecte si un nouveau body a ete ajouter A metre après lapelle de render
			if(this.priv_newBody == true){
				Matter.World.addBody(SkelzEngine.engine.world,this.priv_body);
				this.priv_newBody = false;
			}
		}
		
		Entity.initialized = true;
	}
}

// ROOM -----------------------------------------------
function Room(){
	this.priv_initIsCalled=false;
	this.priv_entityList = [];
	
	
	if(typeof Room.initialized == "undefined"){
		
		/**
		* Méthode interne
		* Méthode gèrer par le moteur de jeux. apelle la méthode init une seule fois avant tous.
		*/
		Room.prototype.preInit = function(){
			if(this.render == "undefined" || this.render == null){
				console.error("The Room class need method: render()");
				alert("The Room class need method: render()");
			}
			
			if(this.init == "undefined" || this.init == null){
				console.error("The Room class need method: init()");
				alert("The Room class need method: init()");
			}
			
			
			//Clear l'encienne room pour en détruire tous les résidus et configure la nouvelle
			Matter.Engine.clear(SkelzEngine.engine);
			
			SkelzEngine.engine.world = Matter.World.create({
			bounds: {
				min: {x: SkelzEngine.priv_const_maxWorldBounds*-1,y: SkelzEngine.priv_const_maxWorldBounds*-1},
				max: {x: SkelzEngine.priv_const_maxWorldBounds,y: SkelzEngine.priv_const_maxWorldBounds}
			} 
			});
			
			this.priv_entityList = [];
			this.init();
		}

		
		/**
		* Méthode interne.
		* Méthode gèrer par le moteur de jeux. apelle la méthode render a tous les frames.
		*/
		Room.prototype.preRender = function(){
	
			this.render();

			//Liste tous les entity et apelle leur methode render.
			for(var i=0; i < this.priv_entityList.length; i++){
				
				if(this.priv_entityList[i] != "undefined"){
					
					if(this.priv_entityList[i].priv_destroyCalled == true){
						//suprime lentité et tous ses enfant
						Matter.Composite.remove(SkelzEngine.engine.world,this.priv_entityList[i].priv_body,true);
						
						//suprimme la référence de lentity dans body
						if(this.priv_entityList[i].priv_body != undefined && this.priv_entityList[i].priv_body != null){
							this.priv_entityList[i].priv_body.entity = undefined;
						}
						
						this.priv_entityList[i].priv_body = undefined;
						this.priv_entityList.splice(i,1);
						//alert(this.priv_entityList.length);
					}else{
						Entity.prototype.preRender.call(this.priv_entityList[i],this);
					}
					
				}
			}
		}
		
		/**
		* Retourne la liste des entité qui ce trouve dans la room.
		*/
		Room.prototype.getEntityList = function(){
			return this.priv_entityList;
		}
		
		/**
		* Une fois l'entité ajouter a la room , L'entity seras gérer par la room en question et la méthode render de la classe Entity seras apeller a chaque frame.
		* Apelle la méthode init de l'entity
		*/
		Room.prototype.add = function(entity){
			if(entity.priv_destroyCalled == true){
				console.error("The entity has destroyed you can not add it to the room. Room add(entity) Error. caused by entity.destroy()");
			}else{
				
				if(this.priv_entityList == undefined){
					//this.priv_entityList = [];
					console.error("Érreure externe au moteur SkelzEngine et cette érreures a des impactes directe sur l'engine et son bon fonctionnement.");
					alert("Érreure externe au moteur SkelzEngine et cette érreures a des impactes directe sur l'engine et son bon fonctionnement.");
				}
				
				Entity.prototype.preInit.call(entity,this);
				this.priv_entityList.push(entity);
			}
		}
		
		/**
		* Libère la mémoire de l'encienne room et passe a la nouvelle room.
		* Cette méthode fais apelle a la méthode statique SkelzEngine.setRoom(room)
		*/
		Room.prototype.nextRoom = function(room){
			SkelzEngine.setRoom(room);
		}

		Room.initialized = true;
	}
	
}


// SKELZENGINE ----------------------------------------

/**
* Classe principal du moteur de jeux
*/
function SkelzEngine(){
	
}

	SkelzEngine.priv_renderCallback;//interne
	SkelzEngine.priv_warningRenderCallback = true;//interne
	SkelzEngine.priv_warningRoomRenderCallback = true;//interne
	SkelzEngine.priv_room;//interne
	SkelzEngine.priv_debugMode = false;//interne
	SkelzEngine.engine;//intern public
	SkelzEngine.priv_setFps_fpsChosenRender = 30;//interne fps par défaux

	
	/**
	* Apelle la fonction callback pour le rendu ("Le rendu seras programmer dans la fonction passer en callback").
	* Le callback seras apeller automatiquement par le moteur de jeux a chaque frame.
	* Le rendu de cette méthode safficheras toujours au dessu des méthodes render() d'une Room
	*/
	SkelzEngine.setRender = function(callback){
		SkelzEngine.priv_renderCallback = callback;
	}
	
	/**
	* Permet de configurer une room qui seras actualiser a toutes les frame ainsi que ca méthode render()
	* Quand l'ont passe une room a cette méthode elle apelle 1 fois la méthode init de la room en question
	* Libère la mémoire de l'encienne room et passe a la nouvelle room.
	*/
	SkelzEngine.setRoom = function(room){
		var entityList = Room.prototype.getEntityList.call(SkelzEngine.priv_room);
		
		//Apelle la méthode destroy de tous les Entity de l'ancienne room.
		if(entityList != "undefined" && entityList != null){
			for(i=0; i < entityList.length; i++){
				if(entityList[i] != "undefined"){
					Entity.prototype.destroy.call(entityList[i]);
				}
			}
			
		}
		
		Matter.Engine.clear(SkelzEngine.engine);
		SkelzEngine.priv_room = room;
		Room.prototype.preInit.call(SkelzEngine.priv_room);
	}
	
	/**
	* Appelle le callback a la fin de l'initialisation.
	*/
	SkelzEngine.init = function(callback){
		SafeInclude.include("SkelzEngine/libs/matter-0.8.0.js");

		SafeInclude.includeReady(
		
		
		function(){
			var fpsCount=0;//utile a la limitation fps
			
			var MyRenderer = {
				
				create: function() {
					return { controller: MyRenderer };
				},

				world: function(engine) {
					//Limitation de fps "par défaut 60"
					//var eachFrame = SkelzEngine.priv_setFps_fpsChosenRender / 60;
					//if(fpsCount >= 1){
						
						// your code here to Room.render()
						if(SkelzEngine.priv_room != "undefined" && SkelzEngine.priv_room != null){
							Room.prototype.preRender.call(SkelzEngine.priv_room);
							SkelzEngine.priv_warningRoomRenderCallback = true;
							
						}else if (SkelzEngine.priv_warningRoomRenderCallback == true){
							if(SkelzEngine.priv_const_showWarnMsg == true)
								console.warn("SkelzEngine.setRoom(Room); Room is not set.");
							SkelzEngine.priv_warningRoomRenderCallback = false;
						}
						
						// your code here to render callback
						if(SkelzEngine.priv_renderCallback != "undefined" && SkelzEngine.priv_renderCallback != null){
							SkelzEngine.priv_renderCallback();
							SkelzEngine.priv_warningRenderCallback = true;
							
						}else if (SkelzEngine.priv_warningRenderCallback == true){
							if(SkelzEngine.priv_const_showWarnMsg == true)
								console.warn("SkelzEngine.setRender(callback); Render callback is not set.");
							SkelzEngine.priv_warningRenderCallback = false;
						}
						
						//fpsCount--;
					//}
					
					//fpsCount+=eachFrame;
					
				},
				
				clear: function(){
				}
				
			}
			
			// create a Matter.js engine
			var engine = Matter.Engine.create({
				render: {
					controller: MyRenderer
				}
			});
			
			//############## Écrase la fonction World.create de matter.js #################
			Matter.World.create = function(options) {
				var composite = Matter.Composite.create();

				var defaults = {
					label: 'World',
					gravity: { x: SkelzEngine.priv_const_globalGravity.x, y: SkelzEngine.priv_const_globalGravity.y },//Est la seul ligne modifier dans cette fonction 
					bounds: { 
						min: { x: 0, y: 0 }, 
						max: { x: 800, y: 600} 
					}
				};
				
				return Matter.Common.extend(composite, defaults, options);
			};
			//########### Fin écrasement ############
			
			SkelzEngine.engine = engine;

			SkelzEngine.engine.world = Matter.World.create({
			bounds: {
				min: {x: SkelzEngine.priv_const_maxWorldBounds*-1,y: SkelzEngine.priv_const_maxWorldBounds*-1},
				max: {x: SkelzEngine.priv_const_maxWorldBounds,y: SkelzEngine.priv_const_maxWorldBounds}
			},
			
			});
			// --- Code pour la configuration des collisions et de son bon fonctionnement.

			
			Matter.Events.on(SkelzEngine.engine, "collisionActive",  function(event){
				var pairs = event.pairs;
				
				for(var i=0; i < pairs.length; i++){
					if(pairs[i].bodyA.entity != undefined && pairs[i].bodyB.entity != undefined){
						if(pairs[i].bodyA.entity.collisionActive != undefined){
							pairs[i].bodyA.entity.collisionActive(pairs[i].bodyB.entity);
						}
						
						if(pairs[i].bodyB.entity.collisionActive != undefined){
							pairs[i].bodyB.entity.collisionActive(pairs[i].bodyA.entity);
						}
					}
				}
				
			});
			
			Matter.Events.on(SkelzEngine.engine, "collisionStart",  function(event){
				var pairs = event.pairs;
				
				for(var i=0; i < pairs.length; i++){
					if(pairs[i].bodyA.entity != undefined && pairs[i].bodyB.entity != undefined){
						if(pairs[i].bodyA.entity.collisionStart != undefined){
							pairs[i].bodyA.entity.collisionStart(pairs[i].bodyB.entity);
						}
						
						if(pairs[i].bodyB.entity.collisionStart != undefined){
							pairs[i].bodyB.entity.collisionStart(pairs[i].bodyA.entity);
						}
					}
				}
				
			});
			
			Matter.Events.on(SkelzEngine.engine, "collisionEnd",  function(event){
				var pairs = event.pairs;
				
				for(var i=0; i < pairs.length; i++){
					if(pairs[i].bodyA.entity != undefined && pairs[i].bodyB.entity != undefined){
						if(pairs[i].bodyA.entity.collisionEnd != undefined){
							pairs[i].bodyA.entity.collisionEnd(pairs[i].bodyB.entity);
						}
						
						if(pairs[i].bodyB.entity.collisionEnd != undefined){
							pairs[i].bodyB.entity.collisionEnd(pairs[i].bodyA.entity);
						}
					}
					
					
				}
				
			});
			
			callback();
			Matter.Engine.run(SkelzEngine.engine);
			
		});
		
		
		/**
		* fonction non terminer les cercles ne sont pas pris en charge.
		*Permet d'afficher un body sur un canvas de facon automatique.
		* Arg 1: context 2d d'un canvas
		* Arg 2: Le body a afficher.
		* arg3: Remplis le déssin = true #::# seulement les ligne = false || Igniorer l'Argument
		* 
		*/
		SkelzEngine.debugDraw = function(context2D, body, fillBoolFacultatif){
			var ctx = context2D;
			
			var center = Matter.Vertices.centre(body.vertices);
			ctx.save();

			
			ctx.translate(center.x,center.y);		
			
			ctx.beginPath();
			var cx=-center.x,cy=-center.y;

			for(var i=0; i < body.vertices.length;i++){
				if(i == 0){
					ctx.moveTo(body.vertices[i].x +cx, body.vertices[i].y +cy);
				}else{
					ctx.lineTo(body.vertices[i].x +cx, body.vertices[i].y +cy );
				}
				
				
			}
			
			ctx.lineTo(body.vertices[0].x +cx, body.vertices[0].y +cy );
			ctx.lineTo(body.vertices[1].x +cx, body.vertices[1].y +cy );
			
			if(fillBoolFacultatif == true)
				ctx.fill();
			else
				ctx.stroke();
				
			
			ctx.restore();
		}
	}
//Fin SkelzEngine class















