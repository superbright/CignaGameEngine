'use strict';


var game = window.game;
var player = window.player;
var highScore = window.highScore;
var competitor = player === 'left' ? 'right' : 'left';

var stepsPerSecond = game.data[player].stepsPerSecond;
var myScore = game.data[player].steps.length;
var competitorScore = game.data[competitor].steps.length;


var Heatmap = require('../viz/heatmap');
new Heatmap('#heatmap-viz', stepsPerSecond);


var Balloon = require('../viz/stats-balloon');
new Balloon('#balloon-viz', highScore, competitorScore, myScore);
// var GameplayController = require('../views/gameplay-controller');
// var gameplayController = new GameplayController($('body'));

