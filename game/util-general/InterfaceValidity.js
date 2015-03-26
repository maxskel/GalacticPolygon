var InterfaceValidity = {
   validatePrototype : function(instance, Interface)
   {
       var methodUnavaible = _.filter(Interface, function(method)
       {
          return (typeof instance[method] == "undefined");
       });

       var validated = _.isEmpty(methodUnavaible) ? true : methodUnavaible;

       if(validated)
       {
           if(typeof  instance.__interfaceValidated == "undefined")
           {
               instance.__interfaceValidated = new Array();
           }

           instance.__interfaceValidated.push(Interface);
       }

       return validated;
   },
   throwError : function(methodUnavailable)
   {
       throw ("\r\n" + _.map(methodUnavailable, function(method) { return "La methode "+ method + " n'est pas implémenté"; }).join("\r\n"));
   }
};