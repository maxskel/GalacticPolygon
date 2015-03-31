var EngineFactory = (function()
{
    return {
        factory : function(engineName)
        {
            switch(engineName)
            {
                case "pixi":
                    return Matter.Engine.create({
                        render: {
                            controller: Matter.RenderPixi,
                            canvas : document.querySelector("#game"),
                            options:
                            {
                                showDebug: true,
                                wireframes: false
                            }
                        }
                    });
                    break;

                default:
                    return Matter.Engine.create({
                        render: {
                            controller: Matter.Render,
                            canvas : document.querySelector("#game"),
                            options:
                            {
                                showDebug: true,
                                wireframes: false
                            }
                        }
                    });
                    break;
            }
        }
    };
})();