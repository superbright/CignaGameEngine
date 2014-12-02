'use strict';

//
// app.js is the entry point for the entire client-side
// application. Any necessary top level libraries should be
// required here (e.g. pym.js), and it should also be
// responsible for instantiating correct viewcontrollers.
//


var emitter = require('./emitter');
// var _ = require('lodash');

var AreaViz = require('./viz/area');
var BalloonViz = require('./viz/balloon');
var StopwatchViz = require('./viz/stopwatch');

var draw = function() {

    var area = new AreaViz('#area-viz');
    var balloon = new BalloonViz('#balloon-viz');
    var stopwatch = new StopwatchViz('#stopwatch-viz', [[], []]);
    

    // send some fake step data
    var count = 0;
    var interval = setInterval(function() {
        var nextX = Math.round(10 + (0.5 - Math.random()) * 5);
        var nextY = Math.round(10 + (0.5 - Math.random()) * 5);

        var newData = [nextX, nextY];

        area.appendData([nextX]);
        stopwatch.appendData(newData);
        balloon.appendData(newData);
        if(count >= 19) {
            clearInterval(interval);
        }
        count++;
    }, 1000);
};

// window.onresize = draw;
draw();

