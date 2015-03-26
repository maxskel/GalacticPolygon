/**
 * Created by darkilliant on 3/25/15.
 */
var KeyboardController = (function()
{
    var KEYDOWN = 1;
    var KEYUP = 2;

    // Todo : separate listenerController and controller
    var classFunction = function() {
        this.direction = {
            horizontal : 0,
            vertical : 0
        };

        this.fire = false;
    };

    _.extend(classFunction.prototype, {
        onKey : function(keyCode, state)
        {
            this.direction = {
                horizontal : 0,
                vertical : 0
            };

            if(state == KEYDOWN)
            {
                //Right
                if(event.keyCode == 39){
                    this.direction.horizontal = 1;
                }

                //left
                if(event.keyCode == 37){
                    this.direction.horizontal = -1;
                }

                //up
                if(event.keyCode == 38){
                    this.direction.vertical = -1;
                }

                //down
                if(event.keyCode == 40){
                    this.direction.vertical = 1;
                }
            }

            //pressBar
            if(event.keyCode == 32){

                if(state == KEYDOWN)
                {
                    this.fire = true;
                }
                else
                {
                    this.fire = false;
                }
            }
        },
        update: function(player)
        {
             //console.log("[CONTROLLER] "+ this.direction.horizontal + " : " + this.direction.vertical);

             player.move(this.direction);

             player.fire = this.fire;
        },
        init : function()
        {
            window.addEventListener("keydown", _.bind(function(event)
            {
                this.onKey(event.keyCode, KEYDOWN);
            }, this));

            window.addEventListener("keyup", _.bind(function(event)
            {
                this.onKey(event.keyCode, KEYUP);
            }, this));
        }
    });

    return classFunction;
})();