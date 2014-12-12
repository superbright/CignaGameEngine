    

// var stepqueue = [];

/*
 * Serial Buffer
 */

function SerialQueue() {
  	this.stepqueue = [];
}

module.exports = SerialQueue;

SerialQueue.prototype.push = function(data) {
    
    this.stepqueue.push(data);

};

SerialQueue.prototype.pop = function() {

    this.stepqueue.shift();
};

SerialQueue.prototype.reset = function() {
    this.stepqueue = [];
};

SerialQueue.prototype.len = function() {
    return this.stepqueue.length;
};


SerialQueue.prototype.queue = function() {
    return this.stepqueue;
};



