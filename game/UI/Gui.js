/**
 * Created by darkilliant on 3/26/15.
 */
var Menu = (function()
{
    var classFunction = function()
    {
        var parent = Room.prototype;
        Room.call(this);
    };

    _.extend(classFunction.prototype, Room.prototype, {
        init: function()
        {
            this.add(new Button());
        },
        render: function()
        {

        }
    });

    return classFunction;
})();