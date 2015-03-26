//Code pour les fonction include et includeReady
var includeInLoad = 0;
var fonctionCalledForInclude;
var intervalCalledForVerification;
var dejasIncluTab = [];

/*
* Permet d'inclure des libs javascript en spécifian le chemain du fichier en argument.
*/
function include(pathName){
	var stopInclude = false;
	
	for(i=0; i < dejasIncluTab.length; i++){
		if(dejasIncluTab[i] == pathName){
			stopInclude = true;
		}
	}
	
	if(stopInclude != true){
		dejasIncluTab.push(pathName);
		
		includeInLoad++;
		
		var imported = document.createElement("script");
		imported.src = pathName;
		imported.type = "text/javascript";
		
		imported.onload = function(){
			includeInLoad--;
		}
		
		document.head.appendChild(imported);
	}
	
}

/*
* Appelle la fonction passer en arguments quand tous les includes son charger.
*/
function includeReady(functionCalling){
	fonctionCalledForInclude = functionCalling;
	intervalCalledForVerification = setInterval(verificationIncludeReady,33);
}

/*
* Fonction appeller par la gestion des includes.
*/
function verificationIncludeReady(){
	if(includeInLoad == 0){
		clearInterval(intervalCalledForVerification);
		fonctionCalledForInclude();
		fonctionCalledForInclude = undefined;
	}
}