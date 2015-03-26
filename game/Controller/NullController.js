/**
 * Created by darkilliant on 3/25/15.
 */
var NullController = (function()
{
    // Todo : separate listenerController and controller
    var classFunction = function() {
        this.direction = {
            horizontal : 0,
            vertical : 0
        };
    };

    _.extend(classFunction.prototype, {
        update: function(player)
        {

        },
        init : function()
        {

        }
    });

    return classFunction;
})();