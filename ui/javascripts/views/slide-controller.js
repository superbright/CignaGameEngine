'use strict';

var _ = require('lodash');
// var utils = require('../utils');
// var htmlContent = require('../../templates/includes/desktop-content.jade');
// var Viz = require('../viz/viz');
var path = require('path');

var bulk = require('bulk-require');
var templates = bulk(__dirname + '/../../../views/', [ '**/*.jade' ]);

var controllers = {
    'gameplay-controller': require('./gameplay-controller')
};


var defaultSlideTime = 2000;


var states = {

    screensaver: {
        screens: [{
            template: 'screensaver/step-up'
        }, {
            template: 'screensaver/win'
        }],

        loop: true
    },

    instructions: {
        screens: [{
            template: 'starting/welcome'
        }, {
            template: 'starting/instructions'
        }],
        loop: false
    },

    countdown: {
        screens: [{
            template: 'countdown/ready'
        }, {
            template: 'countdown/3'
        }, {
            template: 'countdown/2'
        }, {
            template: 'countdown/1'
        }, {
            template: 'countdown/go'
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
            template: 'finishing/leaderboard'
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
    var controllerString = states[this.state].screens[this.index].controller;
    if(!controllerString) {
        return;
    }

    var controller = controllers;
    _.each(controllerString.split('/'), function(str) {
        controller = controller[str];
    });

    return controller;
};


SlideViewController.prototype.shouldLoop = function() {
    return (this.index === (states[this.state].screens.length - 1) && states[this.state].loop);
};


SlideViewController.prototype.setScreen = function() {

    var self = this;
    var s = this.getScreen();
    var t = this.getTemplate();
    this.$el.html(t());

    var Controller = this.getController();
    if(Controller) {
        this.pageController = new Controller($('.inner-container'));
    }

    var screenLength = states[this.state].screens.length;

    if(this.index < screenLength - 1) {
        var to = setTimeout(function() {
            self.index++;
            self.setScreen();
        }, s.duration || defaultSlideTime);

        this.timeouts.push(to);
    } else if(this.shouldLoop()) {
        var to = setTimeout(function() {
            self.index = 0;
            self.setScreen();
        }, s.duration || defaultSlideTime);

        this.timeouts.push(to);
    } else {
        console.log('not setting anything');
    }
}


SlideViewController.prototype.setState = function(state) {
    this.state = state;
    this.index = 0;

    _.each(this.timeouts, function(to) {
        clearTimeout(to);
    });

    this.timeouts = [];
    this.setScreen();
};




SlideViewController.prototype.destroy = function() {
    // this.$el.find('*').unbind().html();
};

module.exports = SlideViewController;
