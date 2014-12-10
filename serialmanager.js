

var serialPort = '/dev/tty.usbserial-A800f82q';
var baudRate = 57600;
var SerialPort = require("serialport").SerialPort

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

   serialPort = new SerialPort('/dev/tty.usbserial-A800f82q', {
        baudrate: 57600
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
                  queue.push('l,30');
        }, 200);


        } else {
            console.log('open');
            
            serialPort.on('data', function(data) {
                console.log('data received: ' + data);
                queue.push(data);
            });
             serialPort.on('close', function(data) {
                console.log('serial closed');
            });

            // serialPort.write("ls\n", function(err, results) {
            //     console.log('err ' + err);
            //     console.log('results ' + results);
            // });
        }
     });

    return queue;
};

SerialManager.prototype.stopSerial = function() {

    if(debugmode) {
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

SerialManager.prototype.getBuffers = function() {
    // TODO:
    // return an array of the serialqueue buffers
    return [];
}