var Logger = (function()
{
    return function()
    {
        this.log = function(level, message)
        {
            console.log("["+level+"] "+message);
        };
    };
})();