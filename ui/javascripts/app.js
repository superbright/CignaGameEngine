'use strict';

// var emitter = require('./emitter');
var _ = require('lodash');


var SlideController = require('./views/slide-controller');
var slideController = new SlideController($('.outer-container'));


var socket = io.connect('http://localhost');

socket.on('step', _.debounce(function (data) {
    //socket.emit('my other event', { my: 'data' });
    if(data.data === -1) {
        return;
    }

    if(slideController.pageController) {
        slideController.pageController.step(data);
    }
}, 400));


socket.on('setState', function(data) {
    console.log(data);

    slideController.setState(data.state);
});

slideController.on('stateEnded', function(data) {
    console.log('stateEnded');
    socket.emit('stateEnded', data);
});
