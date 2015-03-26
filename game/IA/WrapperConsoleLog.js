var WrapperConsoleLog = {
    wrap  : function(logger)
    {
        window.console.log = function(message)
        {
               logger.log("DEBUG", message);
        }
    }
};