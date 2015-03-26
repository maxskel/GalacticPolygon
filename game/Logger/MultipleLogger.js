define([], function()
{
    return function(loggers)
    {
        this.log = function(level, message)
        {
            _.each(loggers, function(logger, k, l)
            {
                logger.log(level, message);
            });
        };
    };
});