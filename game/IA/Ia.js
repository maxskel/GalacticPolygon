var Ia = (function() {

    'use strict';

    return function(environment, logger)
    {
        this.enemyInterfaces = [
           Player
        ];

        this.__constructor = function(environment, logger)
        {
            this.logger = logger;

            this.logger.log("DEBUG", "[IA] Initialized");

            this.environment = environment;
        };

        this.addEnemyInterface = function(enemyInterface)
        {
            this.enemyInterfaces.push(enemyInterface);
        };

        this.update = function()
        {
            var entitys = this.environment.getEntitys();

            var enemys = _.filter(entitys, function(entity)
            {
                return entity instanceof Player;
            });



            this.logger.log("DEBUG", "[IA] update");
        };

        this.__constructor(environment, logger);
    };
})();