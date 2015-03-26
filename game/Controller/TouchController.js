/**
 * Created by darkilliant on 3/25/15.
 */
var TouchController = (function()
{
    var TOUCHSTART = 1;
    var TOUCHEND = 2;
    var TOUCHMOVE = 3;

    // Todo : separate listenerController and controller
    var classFunction = function() {
        this.direction = {
            horizontal : 0,
            vertical : 0
        };

        this.last = null;

        this.fire = false;
    };

    _.extend(classFunction.prototype, {
        update: function(player)
        {
            player.move(this.direction, 0.1);

            player.fire = this.fire;
        },
        onTouch : function(event, state)
        {
            this.fire = (state == TOUCHSTART) ? true : false;

            if(state == TOUCHEND)
            {
                this.direction = {
                    horizontal : 0,
                    vertical : 0
                };
            }
        },
        onTouchMove : function(event)
        {
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
        init : function()
        {
            window.addEventListener("touchstart", _.bind(function(event)
            {
                this.onTouch({
                    x : event.changedTouches[0].pageX,
                    y : event.changedTouches[0].pageY
                },TOUCHSTART);
            }, this));

            window.addEventListener("touchend", _.bind(function(event)
            {
                this.onTouch({
                    x : event.changedTouches[0].pageX,
                    y : event.changedTouches[0].pageY
                },TOUCHEND);
            }, this));

            window.addEventListener("touchmove",  _.bind(function(event)
            {
                this.onTouchMove({
                    x : event.changedTouches[0].pageX,
                    y : event.changedTouches[0].pageY
                });
            }, this));
        }
    });

    return classFunction;
})();