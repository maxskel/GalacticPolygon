var Environment = (function() {
    'use strict';

    return function(logger)
    {
        this.entitys = [];

        this.logger = logger;

        this.addEntity = function(entity)
        {
            this.entitys.push(entity);

            this.logger.log("DEBUG", "[Environment] add Entity");
        };

        this.getEntitys = function()
        {
           return this.entitys;
        };
    };
})();