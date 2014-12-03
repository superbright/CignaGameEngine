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



var states = {

    screensaver: {
        templates: ['screensaver/step-up', 'screensaver/win'],
        loop: true
    },

    instructions: {
        templates: ['starting/instructions'],
        loop: false,
        next: 'countdown'
    },

    countdown: {
        templates: ['countdown/ready', 'countdown/3', 'countdown/2', 'countdown/1', 'countdown/go'],
        loop: false,
        next: 'gameplay'
    },

    gameplay: {
        templates: ['gameplay/index'],
        loop: false,
        controller: 'gameplay-controller',
        // next: 'postgame'
    },

    postgame: {
        templates: ['finishing/finish', 'finishing/leaderboard'],
        loop: false,
        next: 'screensaver'
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

    // this.$el.html(htmlContent({
    //     // template variables go here
    //     // e.g.
    //     //
    //     // someVar: something
    // }));


    // maybe you want to instantiate a vizualization:
    //
    // new Viz(this.$el.find('.viz-selector'));
}




SlideViewController.prototype.getTemplate = function() {
    var template = states[this.state].templates[this.index];

    console.log('fetching template ' + template);

    var templateFunction = templates;
    _.each(template.split('/'), function(str) {
        templateFunction = templateFunction[str];
    });

    return templateFunction;
};


SlideViewController.prototype.getController = function() {
    var controllerString = states[this.state].controller;
    if(!controllerString) {
        return;
    }

    var controller = controllers;
    _.each(controllerString.split('/'), function(str) {
        controller = controller[str];
    });

    return controller;
};


// SlideViewController.prototype.shouldTransition = function() {
//     console.log(this.index);
//     return this.index >= states[this.state].templates.length;
// }

SlideViewController.prototype.getNextState = function() {
    return states[this.state].next;
}


SlideViewController.prototype.setState = function(state) {
    this.state = state;
    this.index = 0;

    var self = this;
    var interval = setInterval(function() {
        
        if(self.index >= states[self.state].templates.length) {
            clearInterval(interval);

            if(states[self.state].next) {
                self.setState(self.getNextState());
            }
        }

        var t = self.getTemplate();

        var str = t();
        console.log(str);
        self.$el.html(str);

        var Controller = self.getController();
        if(Controller) {
            self.pageController = new Controller($('.inner-container'));
        }

        self.index++;
    }, 1000);
};




SlideViewController.prototype.destroy = function() {
    // this.$el.find('*').unbind().html();
};

module.exports = SlideViewController;
