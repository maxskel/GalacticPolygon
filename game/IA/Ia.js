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

        this.setEnvironment = function(environment)
        {
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
                return entity instanceof Monster && entity.getPosition().y > 0 && entity.getPosition().x > 0;
            });

            if(_.isEmpty(enemys))
            {
                console.log("skip");
                return;
            }

            this.defenders = entitys;

            var defender = this.getDefender();

            var distanceEnemys = new Array();

            _.sortBy(enemys, function(enemy)
            {
                return (enemy.getPosition().y - defender.getPosition().y);
            });

            /**
            _.each(enemys, function(enemy)
            {
                console.log("@@ " + enemy.getPosition().y + " : " + defender.getPosition().y);
            });
             */

            var myEnemy = _.first(enemys);

            var enemyPosition = myEnemy.getPosition();
            var defenderPosition = defender.getPosition();

            var direction = {
                horizontal: (enemyPosition.x == defenderPosition.x) ? 0 : (enemyPosition.x > defenderPosition.x ) ? 1 : -1,
                vertical: (defenderPosition.y < 450) ? 0 : -1
            };

//            console.log(direction);

            defender.move(direction, 5);

            defender.fired();

            this.logger.log("DEBUG", "[IA] " + _.size(enemys) + " enemys left");

            this.logger.log("DEBUG", "[IA] update");
        };

        this.__constructor(environment, logger);
    };
})();