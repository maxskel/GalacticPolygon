var InterfaceValidity = {
   validatePrototype : function(instance, Interface)
   {
       var methodUnavaible = _.filter(Interface, function(method)
       {
          return (typeof instance[Interface] == "undefined");
       });

       return _.isEmpty(methodUnavaible) ? true : methodUnavaible;
   },
   throwError : function(methodUnavailable)
   {
       throw ("\r\n" + _.map(methodUnavailable, function(method) { return "La methode "+ method + " n'est pas implémenté"; }).join("\r\n"));
   }
};