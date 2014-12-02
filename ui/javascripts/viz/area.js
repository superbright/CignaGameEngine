'use strict';
var d3 = require('d3');
var _ = require('lodash');

var margin = {
    top: 30,
    right: 20,
    bottom: 20,
    left: 45
};


var LineGraph = function(selector, data, opts) {

    if(!opts) {
        opts = {};
    }

    this.data = data || [10];
    this.opts = opts;
    var self = this;

    var width = Math.min(600, $(selector).width());
    var height = Math.min(width / Math.sqrt(2), 0.7 * $(document).height());


    var yDomain = [0, 20];
    var xDomain = [0, 20];

    this.x = d3.scale.linear()
        .domain(xDomain)
        .range([0, width]);

    this.y = d3.scale.linear()
        .domain(yDomain)
        .range([height, 0]);

    this.area = d3.svg.area()
        .x(function(d, i) { return self.x(i); })
        .y0(height)
        .y1(function(d) { return self.y(d); });


    var svg = d3.select(selector)
        .append('svg:svg')
        .attr('class', 'area-container')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('svg:g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('svg:rect')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'plot');


    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient('bottom')
        .ticks(25);

    svg.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(this.xAxis);

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient('left')
        .ticks(25);

    svg.append('g')
        .attr('class', 'y axis')
        .call(this.yAxis);

    svg.append('g')
        .attr('class', 'x grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(this.xAxis
                .tickSize(-height, 0, 0)
                .tickFormat(''));

    svg.append('g')
        .attr('class', 'y grid')
        .call(this.yAxis
                .tickSize(-width, 0, 0)
                .tickFormat(''));

    var clip = svg.append('svg:clipPath')
        .attr('id', 'clip')
        .append('svg:rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height);

    var chartBody = svg.append('g')
        .attr('clip-path', 'url(#clip)');

    svg.append("linearGradient")
      .attr("id", "area-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", height)
      .attr("x2", 0).attr("y2", 0)
      .selectAll("stop")
      .data([
        {offset: "0%", color: "rgba(255, 204, 0, 0.1)"},
        {offset: "100%", color: "rgba(255, 204, 0, 1)"}
      ])
    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });


    chartBody.append('path')
        .datum(this.data)
        .attr('class', 'line')
        .attr('d', this.area);

    this.svg = svg;
    this.updateCircles();

    // function updateAxis() {

    //     self.svg.select('.x.axis').call(self.xAxis);
    //     self.svg.select('.y.axis').call(self.yAxis);
        
    //     // self.svg.select('.x.grid')
    //     //     .call(makeXAxis()
    //     //         .tickSize(-height, 0, 0)
    //     //         .tickFormat(''));
    //     // self.svg.select('.y.grid')
    //     //     .call(makeYAxis()
    //     //             .tickSize(-width, 0, 0)
    //     //             .tickFormat(''));
    // }


    // this.updateAxis = updateAxis;
    // this.area = area;
    // this.y = y;
    // this.x = x;
};


module.exports = LineGraph;

LineGraph.prototype.updateCircles = function() {
    var self = this;

    var circles = this.svg.selectAll("circle")
      .data(this.data);

    // UPDATE
    // Update old elements as needed.
    // text.attr("class", "update");

    // ENTER
    // Create new elements as needed.
    circles.enter().append("circle")
        .attr('r', 5)
        .attr('class', 'point')
        .attr('fill', 'red')
        .attr('opacity', 0)
        .transition()
        .delay(850)
        .attr('opacity', 1);

    // ENTER + UPDATE
    // Appending to the enter selection expands the update selection to include
    // entering elements; so, operations on the update selection after appending to
    // the enter selection will apply to both entering and updating nodes.
    circles
        .attr('cx', function(d, i) {
            return self.x(i);
        })
        .attr('cy', function(d) {
            return self.y(d);
        });

    // EXIT
    // Remove old elements as needed.
    circles.exit().remove();

};

LineGraph.prototype.appendData = function(data) {
    
    this.data = this.data.concat(data);
    data = this.data;

    // console.log(data);

    var yMax = d3.max(data);
    var yDomain = [0, Math.max(yMax, 20)];

    this.y.domain(yDomain);

    // this.updateAxis();

    this.svg.selectAll('.line')
        .datum(data)
        .transition()
        .duration(1000)
        .attr('d', this.area);


    this.svg.selectAll('.point')
        .data(this.data)
        .transition()
        .delay(1000)
        .duration(0);

    this.updateCircles();
};
