var NullLogger = (function()
{
    return function(element)
    {
        this.log = function(level, message)
        {
        };
    };
})();