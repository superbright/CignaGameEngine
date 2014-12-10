

var serialPort = '/dev/ttys0';
var baudRate = 57600;
var SerialPort = require("serialport").SerialPort

var SerialQeueu = require('./serialqeueu');

/*
 * Serial controller
 */

function SerialManager() {
    if (!(this instanceof SerialManager)) {
        return new SerialManager();
    }
}

module.exports = SerialManager;

SerialManager.prototype.initSerial = function() {

    var serialPort = new SerialPort(serialPort, {
        baudrate: baudRate
    }, false);

};

SerialManager.prototype.startSerial = function() {

      var queue = new SerialQeueu();

      serialPort.open(function(error) {
        if (error) {
            console.log('failed to open: ' + error);
        } else {
            console.log('open');
            serialPort.on('data', function(data) {
                console.log('data received: ' + data);
                queue.push(data);
            });
             serialPort.on('close', function(data) {
                console.log('serial closed');
            });
        
        }
     });

      return queue;
};

SerialManager.prototype.stopSerial = function() {

    serialport.close(function(error) {
        if(error) {
            console.log('failed to close: ' + error);
        } else {
            console.log('close')
        }

    });
};