'use strict';

// var emitter = require('./emitter');
var _ = require('lodash');


var SlideController = require('./views/slide-controller');
var slideController = new SlideController($('.outer-container'));
slideController.setState('screensaver');

var socket = io('/' + window.playerPosition);

socket.on('step', _.debounce(function (data) {
    //socket.emit('my other event', { my: 'data' });
    if(data.data === -1) {
        return;
    }

    if(slideController.pageController) {
        slideController.pageController.step(data.data);
    }
}, 400));


socket.on('setState', function(data) {
    console.log(data);

    slideController.setState(data.state, data);
});

slideController.on('stateEnded', function(data) {
    console.log('stateEnded');
    socket.emit('stateEnded', data);
});

socket.on('boost', function() {

    console.log('ACTIVATING BOOST');
    if(slideController.pageController) {
        slideController.pageController.boost();
    }
});