

var stepqueue = [];

/*
 * Serial Buffer
 */

function SerialQueue() {
  	this.stepqueue = [];
}

module.exports = SerialQueue;

SerialQueue.prototype.push = function(data) {
    
    stepqueue.push(data);

};

SerialQueue.prototype.pop = function() {

    stepqueue.shift();
};

SerialQueue.prototype.reset = function() {
    stepqueue = [];
};

SerialQueue.prototype.len = function() {
    return stepqueue.length;
};


SerialQueue.prototype.queue = function() {
    return stepqueue;
};