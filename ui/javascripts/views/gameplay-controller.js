
var AreaViz = require('../viz/area');
var BalloonViz = require('../viz/balloon');
var StopwatchViz = require('../viz/stopwatch');


/*
 * View controller
 */
function GameplayViewController($el, players) {
    if (!(this instanceof GameplayViewController)) {
        return new GameplayViewController($el);
    }

    this.$el = $el;
    this.players = players;

    console.log('initializing with players');
    console.log(players);
    
    this.area = new AreaViz('#area-viz');
    
    this.balloon = new BalloonViz('#balloon-viz', {
        players: players
    });

    this.stopwatch = new StopwatchViz('#stopwatch-viz', {
        players: players
    });

    this.$messageEl = $('.message-container .message');
    this.$boostEl = $('.boost');
    this.$timerEl = $('.timer-container');

    this.count = 0;

}


module.exports = GameplayViewController;

GameplayViewController.prototype.setMessage = function(msg) {
    this.$messageEl.text(msg);
};

GameplayViewController.prototype.setBoostState = function(state) {
    this.$boostEl.addClass(state);
};

GameplayViewController.prototype.setTimerDisplay = function(seconds) {
    var self = this;
    var formatted = '0:' + (seconds < 10 ? '0' + seconds : seconds);
    setTimeout(function() {
        self.$timerEl.text(formatted);    
    }, 1000);  
};

GameplayViewController.prototype.step = function(data) {

    console.log('STEPPING' + (this.count++));

    this.setTimerDisplay(20 - this.count);
    console.log(data);
    if(window.playerPosition === 'right') {
        data.reverse();
    }

    // TODO - munge data once we decide how everything is transmitted / 
    //        how we discern left and right player

    var nextX = data[0];
    var nextY = data[1];
    var newData = [nextX, nextY];
    this.area.appendData(data[0]);
    this.stopwatch.appendData(data);
    this.balloon.appendData(data);
};