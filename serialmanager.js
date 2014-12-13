

var serialPortString = '/dev/tty.usbmodem1421';
var baudRate = 57600;

var sp = require("serialport");
var SerialPort = sp.SerialPort

var SerialQeueu = require('./serialqeueu');
var serialPort;
var interval;
var debugmode = false;
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

   serialPort = new SerialPort(serialPortString, {
        baudrate: baudRate,
        parser: sp.parsers.readline("\n"),
        buffersize: 64,
    },false);

    console.log('init serial');

};

SerialManager.prototype.startSerial = function() {

      console.log('open serial');  
       var queue = new SerialQeueu();
      serialPort.open(function(error) {
       
        if (error) {
            console.log('failed to open: ' + error);
            console.log('debug run');

            debugmode = true;
            
        interval = setInterval( function() {
                  queue.push('1l,30');
        }, 200);


        } else {
            console.log('open');
            
            serialPort.on('data', function(data) {
                console.log('data received: ' + data    );
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

    if(debugmode || interval) {
         clearInterval(interval);
    }

    serialPort.close(function(error) {
        if(error) {
            console.log('failed to close: ' + error);
        } else {
            console.log('close')
        }
    });
};
