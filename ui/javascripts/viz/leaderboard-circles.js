'use strict';

var _ = require('lodash');
var utils = require('../utils');
var d3 = require('d3');



var data = {
    "name": "Root",
    "children": [],
    "size": 0
};


var numBubbles = 80;
_.each(_.range(numBubbles), function(i) {
    data.children.push({
        name: 'Leaf',
        children: null,
        size: Math.random() * 5 + 7
    });
});

var colors = ['#b2da09', '#0e75c9', '#fd6608', '#f02507', '#0f6f2a', '#17b42e']


/*
 * View controller
 */
function Viz(selector, data) {
    if (!(this instanceof Viz)) {
        return new Viz($el);
    }


    var heirarchy = {
        name: 'Root',
        children: [],
        size: 0
    };


    _.each(data, function(d) {
        heirarchy.children.push({
            name: d.player.firstName,
            children: null,
            size: d.score
        });
    });

    var hi = data[0].score;
    var lo = data[data.length - 1].score;

    if(data.length < 75) {
        _.each(_.range(75 - data.length), function(i) {
            heirarchy.children.push({
                name: 'Empty',
                children: null,
                size: (Math.random() * (hi - lo)) + lo
            })
        })
    }

    var $el = $(selector);
    this.$el = $el;
    var self = this;

    var width = $el.width();
    var height = $el.height();

    var margin = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };

    console.log('initializing bubbles');

    console.log(width, height);

    var bubble = d3.layout.pack()
        .sort( function(a, b) { return  a.size > b.size;} ) // basically a < b always
        .size([width, height])
        .padding(10);

    var svg = d3.select(this.$el[0])
        .append('svg:svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'leaderboard-cirle-container')
        .append('svg:g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  var node = svg.selectAll(".node")
        .data(bubble.nodes(classes(heirarchy))
        .filter(function(d) { return !d.children; }))
        .enter().append("g")
        .attr("class", function(d) {
            return 'node ' + d.className
        })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d, i)  { 
                return colors[Math.floor(Math.random() * colors.length)];
        });

  node.append("text")
      .text(function(d) { return d.value; })
      .attr('dy', 15)
      .attr('text-anchor', 'middle');

  node.append("text")
      .text(function(d) { return d.className; })
      .attr('dy', -5)
      .attr('text-anchor', 'middle');
};

function classes(root) 
{
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}



module.exports = Viz;

