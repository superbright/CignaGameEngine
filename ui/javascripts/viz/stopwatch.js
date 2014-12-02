'use strict';

var _ = require('lodash');
var utils = require('../utils');
var d3 = require('d3')

/*
 * View controller
 */
function Viz(selector, data) {
    if (!(this instanceof Viz)) {
        return new Viz($el);
    }

    var $el = $(selector);
    this.$el = $el;
    this.data = data;
    var self = this;

    // do some cool vizualization here

    var margin = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    var width = Math.min($el.width(), 600);
    var height = width;

    var svg = d3.select(this.$el[0])
        .append('svg:svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'stopwatch-container')
        .append('svg:g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    
    // opponent arc
    this.opponentArc = d3.svg.arc()
        .innerRadius(0.93 * width / 2)
        .outerRadius(width / 2)
        .startAngle(0);

    this.opponentPath = svg.append("path")
        .datum({endAngle: 0})
        .attr("d", this.opponentArc)
        .attr('class', 'opponent')
        .attr("transform", 'translate(' + (width / 2) + ', ' + (width / 2) + ')')


    // opponent arc
    this.myArc = d3.svg.arc()
        .innerRadius(0.84 * width / 2)
        .outerRadius(0.86 * width / 2)
        .startAngle(0);
    
    this.myPath = svg.append("path")
        .datum({endAngle: 0})
        .attr("d", this.myArc)
        .attr('class', 'me')
        .attr("transform", 'translate(' + (width / 2) + ', ' + (width / 2) + ')');


    svg.append('text')
        .attr('x', width/2)
        .attr('y', width/4)
        .attr('text-anchor', 'middle')
        .attr('class', 'my-score');
    
    svg.append('text')
        .attr('x', width/2)
        .attr('y', 3*width/4)
        .attr('text-anchor', 'middle')
        .attr('class', 'opponent-score');



    this.getArcTweenFunc = function(arc) {
        return function (transition, newAngle) {
            transition.attrTween('d', function(d) {
                var interpolate = d3.interpolate(d.endAngle, newAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
            });
        }
    };

    // this.updateArcs();

};



Viz.prototype.getExpectedMax = function() {



    var maxAvg = 0;
    var len = this.data[0].length;

    _.each(this.data, function(steps) {
        var avg = _.reduce(steps, function(memo, num) { return memo + num; }, 0) / len;
        if(avg > maxAvg) {
            maxAvg = avg;
        }
    });

    return 20 * maxAvg;
}

Viz.prototype.calculateAngles = function() {

    var angles = [];
    var expectedMax = this.getExpectedMax();

    // console.log('expected max: ' + expectedMax);

    _.each(this.data, function(steps) {
        var sum = _.reduce(steps, function(memo, num) { return memo + num; }, 0);
        angles.push(2 * Math.PI * sum / expectedMax);
        // console.log(sum / expectedMax);
    });

    return angles;
}

Viz.prototype.updateArcs = function() {

    var angles = this.calculateAngles();

    if(angles.length) {

        this.myPath
            .transition()
            .duration(1000)
            .call(this.getArcTweenFunc(this.myArc), angles[0]);

        d3.select('text.my-score')
            .text(_.reduce(this.data[0], function(memo, num) { return memo + num; }, 0));
    }

    if(angles.length >= 2) {
        this.opponentPath
            .transition()
            .duration(1000)
            .call(this.getArcTweenFunc(this.opponentArc), angles[1]);
        
        d3.select('text.opponent-score')
            .text(_.reduce(this.data[1], function(memo, num) { return memo + num; }, 0));
    }
}




Viz.prototype.appendData = function(newData) {    
    var self = this;
    _.each(newData, function(d, i) {
        self.data[i] = self.data[i].concat(d);
    });

    this.updateArcs();
};


Viz.prototype.destroy = function() {
    // destroy d3 object
};

module.exports = Viz;

