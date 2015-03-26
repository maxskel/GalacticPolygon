Entity.oneHitWarning = false;
function Entity(){

	this.name=undefined;
	this.priv_newBody = false;// Utile au bon fonctionnement des ajouts de body a la room
	this.priv_body = undefined;
	this.priv_destroyCalled = false;

	if(typeof Entity.initialized == "undefined"){

		/**
		* Permet de donné un nom a lentité en question pour la diférencer des autres.
		* le nom est récupérable avec getName();
		*/
		Entity.prototype.setName = function(theEntityName){
			this.name = theEntityName;
		};

		/**
		* Récupère le nom donner a lentité via setName(name) ou undefined
		*/
		Entity.prototype.getName = function(){
			return this.name;
		};

		/**
		* Permet de configurer un body pour les collisions.
		* Un body peut etre creer grace a la classe Bodies et c'est méthode de la lib Matter.js "Matter.Bodies"
		* Détruie et décharge de la mémoire l'ancien Body avant de configurer le nouveau.
		* @param Body
		*/
		Entity.prototype.setBody = function(body){
			if(this.priv_body !== undefined){
				Matter.Composite.remove(SkelzEngine.engine.world, this.priv_body, true);
			}

			if(body !== undefined){
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

		};

		/**
		* Décharge l'entité en mémoire, Suprime l'entité de la room actuel et libèrre la mémoire.
		* Vous ne pouvez plus utiliser une entity apret avoir apeller cette méthode car il ne seras plus valide.
		* vous pouvez vérifier la validiter d'une entity grace a la méthode de l'Entity "isValid();"
		*/
		Entity.prototype.destroy = function(){
			Matter.Composite.remove(SkelzEngine.engine.world,this.priv_body,true);

			this.priv_destroyCalled = true;
		};

		/**
		* Méthode interne.
		* Méthode gèrer par le moteur de jeux. "Classe Room"
		*/
		Entity.prototype.preInit = function(room){

			//Capture des erreures lier au méthode essential au Entity
			if(this.render === undefined){
				console.error("Entity Child need method:[    Entity.prototype.render = function(room){};    ]");
				alert("Entity Child need method:[    Entity.prototype.render = function(room){};    ]");
			}

			if(this.init === undefined){
				console.error("Entity Child need method:[    Entity.prototype.init = function(room){};    ]");
				alert("Entity Child need method:[    Entity.prototype.init = function(room){};    ]");
			}

			if(Entity.oneHitWarning === false && SkelzEngine.priv_const_showWarnMsg === true){


				if(this.collisionStart === undefined){
					console.warn("The Entity class need method collisionStart(Entity_B); for collision.");
				}

				if(this.collisionEnd === undefined){
					console.warn("The Entity class need method collisionEnd(Entity_B); for collision.");
				}

				if(this.collisionActive === undefined){
					console.warn("The Entity class need method collisionActive(Entity_B); for collision.");
				}

				Entity.oneHitWarning = true;
			}

			this.init(room);

			// Detecte si un nouveau body a ete ajouter A metre après lapelle de init
			if(this.priv_newBody === true){
				Matter.World.add(SkelzEngine.engine.world,this.priv_body);
				this.priv_newBody = false;
			}
		};

		/**
		* Méthode interne.
		* Méthode gèrer par le moteur de jeux. "Classe Room"
		*/
		Entity.prototype.preRender = function(room){
			//Ajout de code ici

			this.render(room);

			//Si une Entité ou le body de celle ci dépasse les limite du monde on le détruie automatiquement et on envoi un msg dérreure
			if(this.priv_body !== undefined){

				if(this.priv_body.position.y > SkelzEngine.priv_const_maxWorldBounds || this.priv_body.position.y < SkelzEngine.priv_const_maxWorldBounds*-1  || this.priv_body.position.x > SkelzEngine.priv_const_maxWorldBounds || this.priv_body.position.x < SkelzEngine.priv_const_maxWorldBounds*-1){
					if(SkelzEngine.priv_const_showWarnMsg === true)
						console.warn("The Body/Entity is out of bounds. This Body/Entity has been destroyed by the SkelzEngine. Maximum World Bounds is: X: "+SkelzEngine.priv_const_maxWorldBounds*-1+" Y: "+SkelzEngine.priv_const_maxWorldBounds*-1+" Width: "+SkelzEngine.priv_const_maxWorldBounds+" Height: "+SkelzEngine.priv_const_maxWorldBounds);

					Entity.prototype.destroy.call(this);
				}
			}

			// Detecte si un nouveau body a ete ajouter A metre après lapelle de render
			if(this.priv_newBody === true){
				Matter.World.addBody(SkelzEngine.engine.world,this.priv_body);
				this.priv_newBody = false;
			}
		};

		Entity.initialized = true;
	}
}
_.extend(Entity.prototype, EventDispatcher.prototype, {
    getPosition : function() {
        return this.getBody().position;
    },
    /**
     * Retourne undefined ou le Body configurer via setBody(Body);
     * @return Body or undefined
     */
    getBody : function(){
        return this.priv_body;
    }

});
