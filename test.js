var assert = require('assert');
var idle = require('./');

var synth = require('synthetic-dom-events');

var move = function(element) {
    var ev = synth('mousemove');
    if (element.dispatchEvent) {
        element.dispatchEvent(ev);
    }
    else {
        element.fireEvent('onmousemove', ev);
    }
};

test('create', function() {
    var timer = idle(1000);
    timer.stop();
});

test('idle', function(done) {
    var timer = idle(1000);
    var elapsed = false;

    setTimeout(function() {
        elapsed = true;
    }, 900);
    timer.on('idle', function() {
        timer.stop();
        assert.ok(elapsed);
        done();
    });
    timer.on('active', function() {
        assert.ok(false);
    });
});

test('stop', function(done) {
    var timer = idle(1000);

    setTimeout(function() {
        timer.stop();
    }, 500);

    setTimeout(function() {
        done();
    }, 1500);

    timer.on('idle', function() {
        assert.ok(false);
    });
    timer.on('active', function() {
        assert.ok(false);
    });
});

test('active', function(done) {
    var timer = idle(1000);
    timer.on('idle', function() {
        move(document);
    });
    timer.on('active', function() {
        timer.stop();
        done();
    });
});
