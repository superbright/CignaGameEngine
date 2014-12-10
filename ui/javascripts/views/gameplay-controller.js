
var AreaViz = require('../viz/area');
var BalloonViz = require('../viz/balloon');
var StopwatchViz = require('../viz/stopwatch');


/*
 * View controller
 */
function GameplayViewController($el) {
    if (!(this instanceof GameplayViewController)) {
        return new GameplayViewController($el);
    }

    this.$el = $el;

    
    this.area = new AreaViz('#area-viz');
    this.balloon = new BalloonViz('#balloon-viz');
    this.stopwatch = new StopwatchViz('#stopwatch-viz', [[], []]);

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
    var formatted = '0:' + (seconds < 10 ? '0' + seconds : seconds);
    setTimeout(function() {
        this.$timerEl.text(formatted);    
    }, 1000);  
};

GameplayViewController.prototype.step = function(data) {

    console.log('STEPPING' + (this.count++));

    this.setTimerDisplay(20 - this.count);
    // console.log(data);

    // TODO - munge data once we decide how everything is transmitted / 
    //        how we discern left and right player

    var nextX = data[0];
    var nextY = data[1];
    var newData = [nextX, nextY];
    this.area.appendData([nextX]);
    this.stopwatch.appendData(newData);
    this.balloon.appendData(newData);
};