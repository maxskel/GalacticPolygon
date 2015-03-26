var WebLogger = (function()
{
    return function(element)
    {
        this.log = function(level, message)
        {
            element.innerHTML += "["+level+"] "+message + "<br/>";

            element.scrollTop = element.scrollHeight;
        };
    };
})();