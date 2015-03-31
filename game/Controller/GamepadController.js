/**
 * Created by darkilliant on 3/25/15.
 */
define([], function()
{
    // Todo : separate listenerController and controller
    var classFunction = function() {
        this.direction = {
            horizontal : 0,
            vertical : 0
        };
    };

    var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;

    _.extend(classFunction.prototype, {
        gamepad: new Array(),
        ticking: false,
        update: function(player)
        {
            player.move(this.direction);
        },
        startPolling: function()
        {
            if(!this.ticking)
            {
                this.ticking = true;
                this.tick();
            }
        },
        tick : function()
        {
            this.pollStatus();
            this.scheduleNextTick();
        },
        pollStatus: function()
        {

        },
        tickGamepad: function()
        {
            if(_.isEmpty(this.gamepad))
            {
                return;
            }

            var gamepad = _.first(this.gamepad);

            console.log(gamepad.id);
        },
        scheduleNextTick: function()
        {
           if(this.ticking)
           {
               if(window.requestAnimationFrame)
               {
                    requestAnimationFrame(_.bind(this.tickGamepad, this));
               }
               else if (window.mozRequestAnimationFrame)
               {
                    mozRequestAnimationFrame(_.bind(this.tickGamepad, this));
               }
               else if (window.webkitRequestAnimationFrame)
               {
                   webkitRequestAnimationFrame(_.bind(this.tickGamepad, this));
               }
           }
        },
        init : function()
        {
            var gamepad = navigator.getGamepads();

            if(typeof gamepad[0] != "undefined")
            {
                this.gamepad.push(gamepad[0]);
            }

            window.addEventListener("gamepadconnected", function(e) {
                console.log("Contrôleur n°%d connecté : %s. %d boutons, %d axes.",
                    e.gamepad.index, e.gamepad.id,
                    e.gamepad.buttons.length, e.gamepad.axes.length);

                this.gamepad.push(e.gamepad);

                this.startPolling();
            });

            window.addEventListener("gamepaddisconnected", function(e) {
                console.log("Contrôleur n°%d déconnecté : %s",
                    e.gamepad.index, e.gamepad.id);
            });

            this.startPolling();
        }
    });

    return classFunction;
});