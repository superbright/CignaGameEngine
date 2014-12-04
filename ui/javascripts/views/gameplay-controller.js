
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

    this.count = 0;

}


module.exports = GameplayViewController;


GameplayViewController.prototype.step = function(data) {

    console.log('STEPPING' + (this.count++));
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