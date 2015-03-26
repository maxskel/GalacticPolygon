/**
 * Created by darkilliant on 3/25/15.
 */
var MouseController = (function()
{
    var MOUSEDOWN = 1;
    var MOUSEUP = 2;

    // Todo : separate listenerController and controller
    var classFunction = function() {
        this.direction = {
            horizontal : 0,
            vertical : 0
        };

        this.fire = false;

        this.last = null;

        this.mouseMove = false;

        this.timerMouse = null;
    };

    _.extend(classFunction.prototype, {
        onMouseMove : function(keyCode, state)
        {
            this.mouseMove = true;
            clearTimeout(this.timerMouse);
            this.timerMouse = setTimeout(_.bind(function()
            {
                this.mouseMove = false;
            }, this), 150);

            this.direction = {
                horizontal : 0,
                vertical : 0
            };

            if(this.last === null)
            {
                this.last = {
                   x : event.x,
                   y : event.y
                };
            }

            this.direction.horizontal = (this.last.x > event.x) ? -(this.last.x - event.x) : event.x - this.last.x;
            this.direction.vertical = (this.last.y > event.y) ? -(this.last.y - event.y) : event.y - this.last.y;

            this.last = {
                x : event.x,
                y : event.y
            };
        },
        onMousePress : function(state)
        {
            this.fire = (state == MOUSEDOWN) ? true : false;
        },
        update: function(player)
        {
            //console.log("[CONTROLLER] "+ this.direction.horizontal + " : " + this.direction.vertical);

            if(this.mouseMove)
            {
                player.move(this.direction, 0.1);
            }
            else
            {
                player.move({
                    horizontal : 0,
                    vertical: 0
                });
            }

            player.fire = this.fire;
        },
        init : function()
        {
            window.addEventListener("mousemove", _.bind(function(event)
            {
                this.onMouseMove(event);
            }, this));

            window.addEventListener("mousedown", _.bind(function(event)
            {
                this.onMousePress(MOUSEDOWN);
            }, this));

            window.addEventListener("mouseup", _.bind(function(event)
            {
                this.onMousePress(MOUSEUP);
            }, this));
        }
    });

    return classFunction;
})();