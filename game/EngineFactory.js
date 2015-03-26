var EngineFactory = (function()
{
    return {
        factory : function()
        {
            return Matter.Engine.create({
                render: {
                    controller: Matter.Render,
                    canvas : document.querySelector("#game")
                }
            });
        }
    };
})();