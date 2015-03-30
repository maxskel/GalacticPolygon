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
			if(this.render === undefined){
				console.error("The Room class need method: render()");
				alert("The Room class need method: render()");
			}
			
			if(this.init === undefined){
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
			
			this.init();
		};

		/**
		* Méthode interne.
		* Méthode gèrer par le moteur de jeux. apelle la méthode render a tous les frames.
		*/
		Room.prototype.preRender = function(){
	
			this.render();

			//Liste tous les entity et apelle leur methode render.
			for(var i=0; i < this.priv_entityList.length; i++){
				
				if(this.priv_entityList[i] != "undefined"){
					
					if(this.priv_entityList[i].priv_destroyCalled === true){
						//suprime lentité et tous ses enfant
						//Matter.Composite.remove(SkelzEngine.engine.world,this.priv_entityList[i].priv_body,true);
						
						//suprimme la référence de lentity dans body
						if(this.priv_entityList[i].priv_body !== undefined){
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
		};
		
		/**
		* Retourne la liste des entité qui ce trouve dans la room.
		*/
		Room.prototype.getEntityList = function(){
			return this.priv_entityList;
		};
		
		/**
		* Une fois l'entité ajouter a la room , L'entity seras gérer par la room en question et la méthode render de la classe Entity seras apeller a chaque frame.
		* Apelle la méthode init de l'entity
		*/
		Room.prototype.add = function(entity){
			if(entity.priv_destroyCalled === true){
				console.error("The entity has destroyed you can not add it to the room. Room add(entity) Error. caused by entity.destroy()");
			}else{
				
				if(this.priv_entityList === undefined){
					//this.priv_entityList = [];
					console.error("Érreure externe au moteur SkelzEngine et cette érreures a des impactes directe sur l'engine et son bon fonctionnement.");
					alert("Érreure externe au moteur SkelzEngine et cette érreures a des impactes directe sur l'engine et son bon fonctionnement.");
				}
				
				Entity.prototype.preInit.call(entity,this);
				this.priv_entityList.push(entity);
			}
		};
		
		/**
		* Libère la mémoire de l'encienne room et passe a la nouvelle room.
		* Cette méthode fais apelle a la méthode statique SkelzEngine.setRoom(room)
		*/
		Room.prototype.nextRoom = function(room){
			SkelzEngine.setRoom(room);
		};

		Room.initialized = true;
	}
	
}