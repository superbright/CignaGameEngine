var colors = ['#E20005','#F22306','#FC3607','#FD6808','#FD7A08','#F7A608','#B0DB08','#8FB705','#17B42F','#15A424','#0F712C','#1397E1','#1088CE','#0E75C9','#0A59A5','#043178'].reverse();


// #133674
// #245d9f


'use strict';
var d3 = require('d3');
var _ = require('lodash');

var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};



var HeatMap = function(selector, data) {

    var width = Math.min(600, $(selector).width() - margin.left - margin.right);
    var lineHeight = 150;


    var x = d3.scale.ordinal()
        .domain(_.range(20))
        .rangeBands([0, width]);

    var y = d3.scale.linear()
        .domain([0, 20])
        .range([0, colors.length]);

    var lineX = d3.scale.linear()
        .domain([0, 20])
        .range([0, width]);

    var lineY = d3.scale.linear()
        .domain([0, 20])
        .range([lineHeight, 0]);

    var line = d3.svg.line()
        .x(function(d, i) { return lineX(i); })
        .y(function(d) { return lineY(d); });

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(20)
        .tickFormat(function(d, i){
            console.log(d, i);
            i += 1;
            if(i === 0) {
                return '';
            }

            if(i % 5 === 0) {
                return ':' + ((i < 10) ? '0' : '') + i + 's'
            }

            return ''
        });

    var svg = d3.select(selector)
        .append('svg:svg')
        .attr('class', 'heatmap-container')
        .attr('width', width + margin.left + margin.right)
        .attr('height', lineHeight + 100)
        .append('svg:g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', function(d, i) {
            console.log(i);
            return x(i);
        })
        .attr('y', lineHeight)
        .attr('width', function() {
            return x.rangeBand();
        })
        .attr('height', function() {
            return x.rangeBand();
        })
        .style('stroke', 'white')
        .style('fill', function(d) {
            console.log(y(d), Math.round(y(d)), colors[Math.round(y(d))])
            if(Math.round(y(d)) > colors.length) {
                return colors[colors.length-1];
            } else if(Math.round(y(d)) < 0) {
                return colors[0];
            }
            return colors[Math.round(y(d))];
        });


    svg.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + -10 + ', ' + (lineHeight + x.rangeBand()) + ')')
        .call(xAxis);


    svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('transform', 'translate(' + (x.rangeBand()/2) + ',0)')
        .attr('d', line);

};


module.exports = HeatMap;
