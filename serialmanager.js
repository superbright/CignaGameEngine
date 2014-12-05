

var serialPort = '/dev/tty.usbserial-A800f82q';
var baudRate = 57600;
var SerialPort = require("serialport").SerialPort

var SerialQeueu = require('./serialqeueu');
var serialPort;
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
    });

    console.log('init serial');

};

SerialManager.prototype.startSerial = function() {

      console.log('open serial');  
       var queue = new SerialQeueu();
      serialPort.open(function(error) {
        if (error) {
            console.log('failed to open: ' + error);
            return false;
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

    serialport.close(function(error) {
        if(error) {
            console.log('failed to close: ' + error);
        } else {
            console.log('close')
        }

    });
};