var xtend = require('xtend');

module.exports = function(timeout) {
    return new Idle({ timeout: timeout });
};

// default settings
var defaults = {
    //start as soon as timer is set up
    start: true,
    // timer is enabled
    enabled: true,
    // amount of time before timer fires
    timeout: 30000,
    // what element to attach to
    element: document,
    // activity is one of these events
    events: 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove'
};

var Idle = function(opt) {
    var self = this;

    self.opt = xtend(defaults, opt);
    self.element = self.opt.element;

    self.state = {
        idle: self.opt.idle,
        timeout: self.opt.timeout,
        enabled: self.opt.enabled,
        idle_fn: [],
        active_fn: []
    };

    // wrapper to pass state to toggleState
    self.state.state_fn = function() {
        toggleState(self.state);
    };

    if (self.opt.start) {
        self.start();
    }
};

var proto = Idle.prototype;

proto.start = function() {
    var self = this;
    var state = self.state;
    var element = self.element;

    function handler(ev) {
        // clear any current timouet
        clearTimeout(state.timer_id);

        if (!state.enabled) {
            return;
        }

        if (state.idle) {
            toggleState(state);
        }

        state.timer_id = setTimeout(state.state_fn, state.timeout);
    }

    // to remove later
    state.handler = handler;

    var events = this.opt.events.split(' ');
    for (var i=0 ; i<events.length ; ++i) {
        var event = events[i];
        attach(element, event, handler);
    }

    state.timer_id = setTimeout(self.state.state_fn, state.timeout);
};

// 'idle' | 'active'
proto.on = function(what, fn) {

    var self = this;
    var state = self.state;

    if (what === 'idle') {
        state.idle_fn.push(fn);
    }
    else {
        state.active_fn.push(fn);
    }
};

proto.getElapsed = function() {
    return ( +new Date() ) - this.state.olddate;
};

// Stops the idle timer. This removes appropriate event handlers
// and cancels any pending timeouts.
proto.stop = function() {
    var self = this;
    var state = this.state;
    var element = self.element;

    state.enabled = false;

    //clear any pending timeouts
    clearTimeout(state.timer_id);

    // detach handlers
    var events = this.opt.events.split(' ');
    for (var i=0 ; i<events.length ; ++i) {
        var event = events[i];
        detach(element, event, state.handler);
    }
};

/// private api

// Toggles the idle state and fires an appropriate event.
// borrowed from jquery-idletimer (see readme for link)
function toggleState(state) {
    // toggle the state
    state.idle = !state.idle;

    // reset timeout
    var elapsed = ( +new Date() ) - state.olddate;
    state.olddate = +new Date();

    // handle Chrome always triggering idle after js alert or comfirm popup
    if (state.idle && (elapsed < state.timeout)) {
        state.idle = false;
        clearTimeout(state.timer_id);
        if (state.enabled) {
            state.timer_id = setTimeout(state.state_fn, state.timeout);
        }
        return;
    }

    // fire event
    var event = state.idle ? 'idle' : 'active';

    var fns = (event === 'idle') ? state.idle_fn : state.active_fn;
    for (var i=0 ; i<fns.length ; ++i) {
        fns[i]();
    }
}

// TODO (shtylman) detect at startup to avoid if during runtime?
var attach = function(element, event, fn) {
    if (element.addEventListener) {
        element.addEventListener(event, fn, false);
    }
    else if (element.attachEvent) {
        element.attachEvent('on' + event, fn);
    }
};

var detach = function(element, event, fn) {
    if (element.removeEventListener) {
        element.removeEventListener(event, fn, false);
    }
    else if (element.detachEvent) {
        element.detachEvent('on' + event, fn);
    }
};

