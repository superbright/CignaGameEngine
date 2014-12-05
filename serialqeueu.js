

var stepqueue = [];

/*
 * Serial Buffer
 */

function SerialQueue() {
    
}

module.exports = SerialBuff;

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

