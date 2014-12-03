'use strict';

var _ = require('lodash');
var utils = require('../utils');
var d3 = require('d3');






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


    var opponentArcSize = [0.93 * width / 2, width / 2];
    var myArcSize = [0.80 * width / 2, 0.86 * width / 2];



    // gradients
    var defs = svg.append('svg:defs');


    defs.append("radialGradient")
        .attr("id", "background-gradient")
        .selectAll("stop")
        .data([
            {offset: "40%", color: "#cdd8e1"},
            {offset: "90%", color: "#a0aab3"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    defs.append("radialGradient")
        .attr("id", "player-gradient")
        .selectAll("stop")
        .data([
            {offset: "93%", color: "white"},
            {offset: "100%", color: "#94adc4"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });




    
    // background-circle
    svg.append('circle')
        .attr('d', this.opponentArc)
        // .attr('class', 'background')
        .attr('fill', 'url(#background-gradient)')
        .attr('r', width / 2 - 5)
        .attr('transform', 'translate(' + (width / 2) + ', ' + (width / 2) + ')');








    
    // competitor circles

    var myCircleG = svg.append('g')
        .attr('class', 'me')
        .attr('transform', 'translate(' + (width / 2) + ', ' + ((width / 2) - 100) + ')');

    myCircleG.append('circle')
        // .attr('class', 'me')
        .attr('fill', 'url(#player-gradient)')
        .attr('r', width / 4 - 25);

    myCircleG
        .append('text')
        .attr('class', 'player-name')
        .attr('text-anchor', 'middle')
        .attr('dy', -25)
        .text('MATTHEW');
    
    myCircleG
        .append('text')
        .attr('class', 'score')
        .attr('text-anchor', 'middle')
        .attr('dy', 35)
        .text('0');


    var opponentCircleG = svg.append('g')
        .attr('class', 'competitor')
        .attr('transform', 'translate(' + (width / 2) + ', ' + ((width / 2) + 125) + ')');


    opponentCircleG.append('circle')
        // .attr('class', 'competitor')
        .attr('fill', 'url(#player-gradient)')
        .attr('r', width / 6 - 25);
        
    opponentCircleG
        .append('text')
        .attr('class', 'player-name')
        .attr('text-anchor', 'middle')
        .attr('dy', -25)
        .text('OPPONENT');
    
    opponentCircleG
        .append('text')
        .attr('class', 'score')
        .attr('text-anchor', 'middle')
        .attr('dy', 25)
        .text('0');


    // opponent arc
    this.opponentArc = d3.svg.arc()
        .innerRadius(opponentArcSize[0])
        .outerRadius(opponentArcSize[1])
        .startAngle(0);

    this.opponentPlaceholderPath = svg.append("path")
        .datum({endAngle: 2 * Math.PI})
        .attr("d", this.opponentArc)
        .attr('class', 'opponent-placeholder')
        .attr("transform", 'translate(' + (width / 2) + ', ' + (width / 2) + ')');

    this.opponentPath = svg.append("path")
        .datum({endAngle: 0})
        .attr("d", this.opponentArc)
        .attr('class', 'opponent')
        .attr("transform", 'translate(' + (width / 2) + ', ' + (width / 2) + ')');


    // opponent arc
    this.myArc = d3.svg.arc()
        .innerRadius(myArcSize[0])
        .outerRadius(myArcSize[1])
        .startAngle(0);
    
    this.myPath = svg.append("path")
        .datum({endAngle: 0})
        .attr("d", this.myArc)
        .attr('class', 'me')
        .attr("transform", 'translate(' + (width / 2) + ', ' + (width / 2) + ')');


    this.getArcTweenFunc = function(arc) {
        return function (transition, newAngle) {
            transition.attrTween('d', function(d) {
                var interpolate = d3.interpolate(d.endAngle, newAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
            }).ease('linear');
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
            .ease('linear')
            .duration(1000)
            .call(this.getArcTweenFunc(this.myArc), angles[0]);

        d3.select('g.me .score')
            .text(_.reduce(this.data[0], function(memo, num) { return memo + num; }, 0));
    }

    if(angles.length >= 2) {
        this.opponentPath
            .transition()
            .ease('linear')
            .duration(1000)
            .call(this.getArcTweenFunc(this.opponentArc), angles[1]);
        
        d3.select('g.competitor .score')
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

