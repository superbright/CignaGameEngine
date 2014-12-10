'use strict';

var _ = require('lodash');
var utils = require('../utils');
var d3 = require('d3');

var bottomOffset = 5;

/*
 * View controller
 */
function Viz(selector, opts) {
    console.log('drawing balloon');

    if (!(this instanceof Viz)) {
        return new Viz($el);
    }

    var $el = $(selector);

    this.$el = $el;

    opts = _.defaults(opts || {}, {
        players: [],
        highScore: 250
    });

    var width = Math.min($el.width(), 600);
    var height = Math.min(width / Math.sqrt(2), 0.7 * $(document).height());

    var numPlayers = opts.players.length;
    var highScore = opts.highScore;

    var scores = Array.apply(null, new Array(numPlayers)).map(Number.prototype.valueOf, 0);
    scores = [highScore].concat(scores);

    console.log(scores);

    // do some cool vizualization here

    var yDomain = d3.extent(scores, function(d) {
        return d;
    });

    var ySpread = Math.abs(yDomain[0] - yDomain[1]);

    console.log(yDomain);
    
    var x = d3.scale.ordinal()
        .domain(_.range(numPlayers+1))
        .rangeRoundBands([0, width], .1);

    console.log(x.domain())

    var y = d3.scale.linear()
        .domain([yDomain[0], yDomain[1] + ySpread * 0.35])
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
        .orient('bottom')
        // .tickFormat(function(d, i){
        //     console.log(d, i);
        //     if(d === 0) {
        //         return '0';
        //     }

        //     if(i % 10 === 0) {
        //         return i + ' sec'
        //     }

        //     return ''
        // });

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(30);

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // svg.append('g')
    //     .attr('class', 'x grid')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(makeXAxis()
    //     .tickSize(-height, 0, 0)
    //     .tickFormat(''));



    
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
        .attr('dy', 30);



    svg.append('g')
        .attr('class', 'y grid')
        .call(yAxis
                .tickSize(-width, 0, 0)
                .tickFormat('')
        );

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

Viz.prototype.appendData = function(data) {

    // console.log(data);

    if(data.length >= 2) {
        // opponent
        this.data[1] = this.data[1] + data[1];
        // you
        this.data[2] = this.data[2] + data[0];
    } else {
        this.data[1] = this.data[1] + data[0];
    }
    
    this.updateBalloons();
}


Viz.prototype.destroy = function() {
    // destroy d3 object
};

module.exports = Viz;
