
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

    
    var area = new AreaViz('#area-viz');
    var balloon = new BalloonViz('#balloon-viz');
    var stopwatch = new StopwatchViz('#stopwatch-viz', [[], []]);


    // send some fake step data
    var count = 0;
    var interval = setInterval(function() {
        var nextX = Math.round(10 + (0.5 - Math.random()) * 5);
        var nextY = Math.round(10 + (0.5 - Math.random()) * 5);

        var newData = [nextX, nextY];

        area.appendData([nextX]);
        stopwatch.appendData(newData);
        balloon.appendData(newData);
        if(count >= 19) {
            clearInterval(interval);
        }
        count++;
    }, 1000);


    // this.$el.html(htmlContent({
    //     // template variables go here
    //     // e.g.
    //     //
    //     // someVar: something
    // }));


    // maybe you want to instantiate a vizualization:
    //
    // new Viz(this.$el.find('.viz-selector'));
}



module.exports = GameplayViewController;