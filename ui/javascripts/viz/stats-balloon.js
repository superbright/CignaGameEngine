'use strict';

var _ = require('lodash');
var utils = require('../utils');
var d3 = require('d3');

var bottomOffset = 5;

/*
 * View controller
 */
function Viz(selector, highScore, competitorScore, myScore) {
    console.log('drawing balloon');

    if (!(this instanceof Viz)) {
        return new Viz($el);
    }

    var $el = $(selector);

    this.$el = $el;

    var width = Math.min($el.width(), 600);
    var height = Math.min(width / Math.sqrt(3));

    var numPlayers = 2;
    if(competitorScore === 0) {
        numPlayers = 1;
    }


    var scores;
    if(numPlayers === 2) {
        var scores = [highScore, competitorScore, myScore];    
    } else {
        var scores = [highScore, myScore];
    }

    

    var yDomain = d3.extent(scores, function(d) {
        return d;
    });

    yDomain = [0, yDomain[1]];

    var ySpread = Math.abs(yDomain[0] - yDomain[1]);

    console.log(yDomain);
    
    var x = d3.scale.ordinal()
        .domain(_.range(numPlayers+1))
        .rangeRoundBands([0, width], .1);

    console.log(x.domain())

    var y = d3.scale.linear()
        .domain([0, yDomain[1] + ySpread * 0.50])
        .range([height, 0]);

    var margin = {
        top: x.rangeBand() / 4,
        left: 0,
        right: 0,
        bottom: 45
    };

    var svg = d3.select(this.$el[0])
        .append('svg:svg')
        .attr('class', 'balloon')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('svg:g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(30);

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    



    svg.append('g')
        .attr('class', 'y grid')
        .call(yAxis
                .tickSize(-width, 0, 0)
                .tickFormat('')
        );


    svg.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (height + bottomOffset) + ')')
        .call(xAxis
                .tickFormat(function(d, i) {
                    console.log(d, i);
                    if(d === 0) {
                        return 'LEADER';
                    } else if(d === 1) {
                        return (numPlayers > 1) ? 'COMPETITOR' : 'ME';
                    }

                    return 'ME';
                }));

    svg.selectAll('.x.axis .tick text')
        .attr('dy', 20);

    var lastY = 0;
    svg.selectAll('.y.grid .tick')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', '100%')
        .attr('height', function(d, i) {

            if(i === 0) return 0;

            console.log(d, i);
            var h = Math.abs(y(d) - y(lastY));
            lastY = d;

            return h;
        });

    var clip = svg.append('svg:clipPath')
        .attr('id', 'clip')
        .append('svg:rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height + bottomOffset);

    var chartBody = svg.append('g')
        .attr('clip-path', 'url(#clip)');

    // draw high score

    // this.data = sc;
    this.x = x;
    this.y = y;
    this.chartBody = chartBody;

    this.data = scores;
    this.updateBalloons();

}

Viz.prototype.updateBalloons = function() {

    var self = this;

    var balloonGroups =  this.chartBody.selectAll('.balloon-container')
        .data(this.data);


    var balloonContainer = balloonGroups
        .enter()
        .append('g')
        .attr('class', 'balloon-container');

    balloonContainer
        .append('line')
        .attr('x1', function(d, i) {
            return self.x(i) + self.x.rangeBand() / 2;
        })
        .attr('y1', function(d, i) {
            return self.y(0);
        })
        .attr('x2', function(d, i) {
            return self.x(i) + self.x.rangeBand() / 2;
        });

    balloonContainer
        .append('circle')
        .attr('class', 'outer')
        .attr('cx', function(d, i) {
            console.log(i);
            return self.x(i) + self.x.rangeBand() / 2;
        }).attr('r', function() {
            return self.x.rangeBand() / 3 + 20;
        });
    balloonContainer
        .append('circle')
        .attr('class', 'inner')
        .attr('cx', function(d, i) {
            console.log(i);
            return self.x(i) + self.x.rangeBand() / 2;
        }).attr('r', function() {
            return self.x.rangeBand() / 3;
        });




    balloonContainer
        .append('text')
        .attr('x', function(d, i) {
            return self.x(i) + self.x.rangeBand() / 2;
        })
        .attr('text-anchor', 'middle');



    balloonGroups
        .select('circle.inner')
        .transition()
        .ease('linear')
        .duration(1000)
        .attr('cy', function(d, i) {
            // console.log(d, i);
            return self.y(d);
        });

    balloonGroups
        .select('circle.outer')
        .transition()
        .ease('linear')
        .duration(1000)
        .attr('cy', function(d, i) {
            // console.log(d, i);
            return self.y(d);
        });


    balloonGroups
        .select('line')
        .transition()
        .ease('linear')
        .duration(1000)
        .attr('y2', function(d, i) {
            return self.y(d) + (self.x.rangeBand() / 3 + 20);
        });

    balloonGroups
        .select('text')
        .transition()
        .ease('linear')
        .duration(1000)
        .text(function(d, i) {
            return d;
        })
        .attr('y', function(d, i) {
            return self.y(d);
        })
        .attr('dy', 12);

    balloonGroups.exit().remove();

}

module.exports = Viz;
