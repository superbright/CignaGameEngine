'use strict';

var _ = require('lodash');
// var utils = require('../utils');
// var htmlContent = require('../../templates/includes/desktop-content.jade');
// var Viz = require('../viz/viz');
var path = require('path');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

var bulk = require('bulk-require');
var templates = bulk(__dirname + '/../../../views/', [ '**/*.jade' ]);

var controllers = {
    'gameplay-controller': require('./gameplay-controller'),
    'leaderboard-controller': require('./leaderboard-controller')
};


var SECONDS = 1000;
var defaultSlideTime = 3000;


var states = {

    screensaver: {
        screens: [{
            template: 'screensaver/big-cigna',
            duration: 4000
        }, {
            template: 'screensaver/dual-logo',
            duration: 4000
        }, {
            template: 'screensaver/step-up',
            duration: 4000
        }, {
            template: 'screensaver/win',
            duration: 4000
        }, {
            template: 'screensaver/leaderboard',
            duration: 4000
        }],
        loop: false
    },

    instructions: {
        screens: [{
            template: 'starting/welcome'
        }, {
            template: 'starting/instructions',
            duration: 5000
        }],
        loop: false
    },

    countdown: {
        screens: [{
            template: 'countdown/ready'
        }, {
            template: 'countdown/3',
            duration: 1000
        }, {
            template: 'countdown/2',
            duration: 1000
        }, {
            template: 'countdown/1',
            duration: 1000
        }, {
            template: 'countdown/go',
            duration: 500
        }],
        loop: false
    },

    gameplay: {
        screens: [{
            template: 'gameplay/index',
            controller: 'gameplay-controller'
        }],
        loop: false
    },

    postgame: {
        screens: [{
            template: 'finishing/finish'
        }, {
            template: 'finishing/way-to-go'
        }, {
            template: 'finishing/leaderboard',
            controller: 'leaderboard-controller',
            duration: 4000
        }],
        loop: false
    }
}

/*
 * View controller
 */
function SlideViewController($el) {
    if (!(this instanceof SlideViewController)) {
        return new SlideViewController($el);
    }

    this.$el = $el;
    this.timeouts = [];
}


inherits(SlideViewController, EventEmitter);

SlideViewController.prototype.getScreen = function() {
    return states[this.state].screens[this.index];
};



SlideViewController.prototype.getTemplate = function() {
    var template = states[this.state].screens[this.index].template;

    console.log('fetching template ' + template);

    var templateFunction = templates;
    _.each(template.split('/'), function(str) {
        templateFunction = templateFunction[str];
    });

    return templateFunction;
};


SlideViewController.prototype.getController = function() {
    console.log('getting controller');
    var controllerString = states[this.state].screens[this.index].controller;
    if(!controllerString) {
        return;
    }


    console.log(controllerString);
    var controller = controllers;
    _.each(controllerString.split('/'), function(str) {
        controller = controller[str];
    });

    console.log(controller);

    return controller;
};


SlideViewController.prototype.shouldLoop = function() {
    return (this.index === (states[this.state].screens.length - 1) && states[this.state].loop);
};


SlideViewController.prototype.setScreen = function(data) {

    var self = this;
    var s = this.getScreen();
    var t = this.getTemplate();
    this.$el.html(t());

    var Controller = this.getController();
    if(Controller) {
        console.log('Controller');
        this.pageController = new Controller($('.inner-container'), data);
    } else {
        this.pageController = null;
    }

    var screenLength = states[this.state].screens.length;

    var to = setTimeout(function() {

        if(self.index < screenLength - 1) {
            self.index++;
            self.setScreen(data);
        } else if(self.shouldLoop()) {
            self.index = 0;
            self.setScreen(data);
        } else {
            self.emit('stateEnded', {state: self.state});
        }
    }, s.duration || defaultSlideTime);
    this.timeouts.push(to);

}


SlideViewController.prototype.setState = function(state, data) {
    this.state = state;
    this.index = 0;

    _.each(this.timeouts, function(to) {
        clearTimeout(to);
    });

    this.timeouts = [];
    this.setScreen(data);
};




SlideViewController.prototype.destroy = function() {
    // this.$el.find('*').unbind().html();
};

module.exports = SlideViewController;




