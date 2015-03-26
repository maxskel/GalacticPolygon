var Ia = (function() {

    'use strict';

    return function(environment, logger)
    {
        this.enemyInterfaces = [
           Player
        ];

        this.defenders = [];

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

        this.addDefender = function(defender)
        {
            this.defenders.push(defender);
        };

        this.getDefender = function()
        {
            return _.first(this.defenders);
        };

        this.update = function()
        {
            var entitys = this.environment.getEntitys();

            var enemys = _.filter(entitys, function(entity)
            {
                return entity instanceof Player;
            });

            this.defenders = entitys;

            var defender = this.getDefender();

            defender.move({
                horizontal: 1,
                vertical: 0
            });

            defender.fired();

            this.logger.log("DEBUG", "[IA] " + _.size(enemys) + " enemys left");

            this.logger.log("DEBUG", "[IA] update");
        };

        this.__constructor(environment, logger);
    };
})();