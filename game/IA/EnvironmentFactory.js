define(["./Environement"], function(Environment)
{
    'use strict';

    return {
        factoryFromRoom : function(room, logger)
        {
            var environment = new Environment(logger);

            _.each(room.getEntityList(), function(v, k, l)
            {
                environment.addEntity(v);
            });

            return environment;
        }
    };
});