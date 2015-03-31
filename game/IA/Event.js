var EventDispatcher = (function()
{
    var Event = function(){};

    _.extend(Event.prototype, {

        events: [],

        addEventListener: function (eventName, handle) {
            if (typeof this.events[eventName] == "undefined") {
                this.events[eventName] = [];
            }

            this.events[eventName].push(handle);
        },

        notify: function (eventname) {
            _.each(this.events[eventname], function (v, k, l) {
                v();
            });
        }
    });

    return Event;
})();

