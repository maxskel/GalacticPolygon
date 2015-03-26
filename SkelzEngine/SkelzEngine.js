//SkelzEngine actuel utilise la lib Matter.js 0.8.0
//Voir le code appret cette classe gère les include et la classe principal SkelzEngine
// pour raptogame.com fait par Maxime Wuyts
// #NOTE#
/**
 Dev: Les Matter.Body peuve contenir des Entity le membre des Entity est entity (body.entity)
 Tous les méthode et classe ne peuve etre utiliser sans que l'engine soi bien charger.
 Pour être sur que tous est bien charger vous devez commencer a programmer dans le callback de la méthode statique SkelzEngine.init(callback);
 */


function SkelzEngine() {}

SkelzEngine.priv_const_maxWorldBounds = 400; // 2100000000 //Défénie les dimention maximum des mondes World/Room
SkelzEngine.priv_const_globalGravity = {x: 0.0000, y: 0.0000};// Gravité constante des mondes.
SkelzEngine.priv_const_showWarnMsg = true;
SkelzEngine.priv_const_setFps_fpsChosenPhys = 20;//Fps du moteur physique de Matter.js SkelzEngine.setFps(fps); pour changer le fps des renders

SkelzEngine.priv_renderCallback = undefined;//interne
SkelzEngine.priv_warningRenderCallback = true;//interne
SkelzEngine.priv_warningRoomRenderCallback = true;//interne
SkelzEngine.priv_room = undefined;//interne
SkelzEngine.priv_debugMode = false;//interne
SkelzEngine.engine = undefined;//intern public


/**
 * Apelle la fonction callback pour le rendu ("Le rendu seras programmer dans la fonction passer en callback").
 * Le callback seras apeller automatiquement par le moteur de jeux a chaque frame.
 * Le rendu de cette méthode safficheras toujours au dessu des méthodes render() d'une Room
 */
SkelzEngine.setRender = function(callback){
    SkelzEngine.priv_renderCallback = callback;
};

/**
 * Permet de configurer une room qui seras actualiser a toutes les frame ainsi que ca méthode render()
 * Quand l'ont passe une room a cette méthode elle apelle 1 fois la méthode init de la room en question
 * Libère la mémoire de l'encienne room et passe a la nouvelle room.
 */
SkelzEngine.setRoom = function(room){
    var entityList = Room.prototype.getEntityList.call(SkelzEngine.priv_room);

    //Apelle la méthode destroy de tous les Entity de l'ancienne room.
    if(entityList !== undefined){

        for(i=0; i < entityList.length; i++){
            if(entityList[i] != "undefined"){
                Entity.prototype.destroy.call(entityList[i]);
            }
        }

    }

    Matter.Engine.clear(SkelzEngine.engine);
    SkelzEngine.priv_room = room;
    Room.prototype.preInit.call(SkelzEngine.priv_room);
};

/**
 * Appelle le callback a la fin de l'initialisation.
 */
SkelzEngine.init = function(callback, customEngine){
/**
    SafeInclude.include("SkelzEngine/libs/matter-0.8.0.min.js");
    SafeInclude.include("SkelzEngine/modules/Room.js");
    SafeInclude.include("SkelzEngine/modules/Entity.js");
*/
    if(typeof customEngine == "undefined") customEngine = null;

    SafeInclude.includeReady(
        function(){
            var MyRenderer = {
                create: function() {
                    return { controller: MyRenderer };
                },
                world: function(engine) {
                    //Limitation de fps "par défaut 60"
                    if(SkelzEngine.priv_room !== undefined){
                        Room.prototype.preRender.call(SkelzEngine.priv_room);
                        SkelzEngine.priv_warningRoomRenderCallback = true;

                    }else if (SkelzEngine.priv_warningRoomRenderCallback === true){
                        if(SkelzEngine.priv_const_showWarnMsg === true)
                            console.warn("SkelzEngine.setRoom(Room); Room is not set.");
                        SkelzEngine.priv_warningRoomRenderCallback = false;
                    }

                    // your code here to render callback
                    if(SkelzEngine.priv_renderCallback !== undefined){
                        SkelzEngine.priv_renderCallback();
                        SkelzEngine.priv_warningRenderCallback = true;

                    }else if (SkelzEngine.priv_warningRenderCallback === true){
                        if(SkelzEngine.priv_const_showWarnMsg === true)
                            console.warn("SkelzEngine.setRender(callback); Render callback is not set.");
                        SkelzEngine.priv_warningRenderCallback = false;
                    }
                },
                clear: function(){
                }
            };

            // create a Matter.js engine
            var engine = (customEngine === null) ? Matter.Engine.create({
                render: {
                    controller: MyRenderer
                }
            }) : customEngine;

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
                }
            });

            // --- Code pour la configuration des collisions et de son bon fonctionnement.
            Matter.Events.on(SkelzEngine.engine, "collisionActive",  function(event){
                var pairs = event.pairs;

                for(var i=0; i < pairs.length; i++){
                    if(pairs[i].bodyA.entity !== undefined && pairs[i].bodyB.entity !== undefined){
                        if(pairs[i].bodyA.entity.collisionActive !== undefined){
                            pairs[i].bodyA.entity.collisionActive(pairs[i].bodyB.entity);
                        }

                        if(pairs[i].bodyB.entity.collisionActive !== undefined){
                            pairs[i].bodyB.entity.collisionActive(pairs[i].bodyA.entity);
                        }
                    }
                }

            });

            Matter.Events.on(SkelzEngine.engine, "collisionStart",  function(event){
                var pairs = event.pairs;

                for(var i=0; i < pairs.length; i++){
                    if(pairs[i].bodyA.entity !== undefined && pairs[i].bodyB.entity !== undefined){
                        if(pairs[i].bodyA.entity.collisionStart !== undefined){
                            pairs[i].bodyA.entity.collisionStart(pairs[i].bodyB.entity);
                        }

                        if(pairs[i].bodyB.entity.collisionStart !== undefined){
                            pairs[i].bodyB.entity.collisionStart(pairs[i].bodyA.entity);
                        }
                    }
                }

            });

            Matter.Events.on(SkelzEngine.engine, "collisionEnd",  function(event){
                var pairs = event.pairs;

                for(var i=0; i < pairs.length; i++){
                    if(pairs[i].bodyA.entity !== undefined && pairs[i].bodyB.entity !== undefined){
                        if(pairs[i].bodyA.entity.collisionEnd !== undefined){
                            pairs[i].bodyA.entity.collisionEnd(pairs[i].bodyB.entity);
                        }

                        if(pairs[i].bodyB.entity.collisionEnd !== undefined){
                            pairs[i].bodyB.entity.collisionEnd(pairs[i].bodyA.entity);
                        }
                    }
                }
            });
            //Fin code collision

            callback();
            Matter.Engine.run(SkelzEngine.engine);

        });

    SkelzEngine.setController = function(controller)
    {
        controller.init();

        SkelzEngine.controller = controller;
    };

    SkelzEngine.getController = function()
    {
        return (typeof SkelzEngine.controller != "undefined") ? SkelzEngine.controller : null;
    };

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
        var cx=-center.x,cy=-center.y;

        ctx.save();

        ctx.strokeStyle = body.render.fillStyle;
        ctx.fillStyle = body.render.fillStyle;

        ctx.translate(center.x,center.y);
        ctx.beginPath();

        for(var i=0; i < body.vertices.length;i++){
            if(i === 0){
                ctx.moveTo(body.vertices[i].x +cx, body.vertices[i].y +cy);
            }else{
                ctx.lineTo(body.vertices[i].x +cx, body.vertices[i].y +cy );
            }
        }

        ctx.lineTo(body.vertices[0].x +cx, body.vertices[0].y +cy );
        ctx.lineTo(body.vertices[1].x +cx, body.vertices[1].y +cy );

        if(fillBoolFacultatif === true)
            ctx.fill();
        else
            ctx.stroke();

        ctx.restore();
    };
};
//Fin SkelzEngine class

/**
 * #CLASSE INTERNE# #Internal Class#
 * Classe qui permet de charger de facon sécuritaire tous les éléments du moteur de jeux et autre include avant son utilisation.
 *
 */
function SafeInclude() {}

//Code pour les fonction include et includeReady
SafeInclude.includeInLoad = 0;
SafeInclude.fonctionCalledForInclude = undefined;
SafeInclude.intervalCalledForVerification = undefined;
SafeInclude.dejasIncluTab = [];

/**
 * Permet d'inclure des libs javascript en spécifian le chemain du fichier en argument.
 */
SafeInclude.include = function (pathName) {
	var stopInclude = false;

	for (var i=0; i < SafeInclude.dejasIncluTab.length; i++){
		if(SafeInclude.dejasIncluTab[i] == pathName){
			stopInclude = true;
		}
	}

	if(stopInclude !== true){
		SafeInclude.dejasIncluTab.push(pathName);
		SafeInclude.includeInLoad++;

		var imported = document.createElement("script");
		imported.src = pathName;
		imported.type = "text/javascript";

		imported.onload = function(){
			SafeInclude.includeInLoad--;
		};
		document.head.appendChild(imported);
	}
};

/**
 * Appelle la fonction passer en arguments quand tous les includes son charger.
 */
SafeInclude.includeReady = function(functionCalling){
    SafeInclude.fonctionCalledForInclude = functionCalling;
    SafeInclude.intervalCalledForVerification = setInterval(SafeInclude.verificationIncludeReady,50);
};

/**
 * Fonction appeller par la gestion des includes.
 */
SafeInclude.verificationIncludeReady = function(){
    if(SafeInclude.includeInLoad === 0){
        clearInterval(SafeInclude.intervalCalledForVerification);
        SafeInclude.fonctionCalledForInclude();
        SafeInclude.fonctionCalledForInclude = undefined;
    }
};
// Fin SafeInclude class