

var serialPortString = '/dev/tty.usbmodem590551';
var baudRate = 9600;

var sp = require("serialport");
var SerialPort = sp.SerialPort

var serialPort;
var interval;
var debugmode = false;

var opened = false;
/*
 * Serial controller
 */

function LedManager() {
    if (!(this instanceof LedManager)) {
        return new LedManager();
    }
}

module.exports = LedManager;

LedManager.prototype.initSerial = function() {

   serialPort = new SerialPort(serialPortString, {
        baudrate: baudRate,
        parser: sp.parsers.readline("\n"),
        buffersize: 64,
    },false);

   serialPort.open(function(error) {
    if(error) {
        console.log(error);
    } else {
        opened = true;
    }

   })

    console.log('init serial');

};

LedManager.prototype.sendStepValues = function(left, right) {

    if(!opened) {
        throw new Error('Must open serial port first!');
    }

    console.log(left, right);

    serialPort.write(left + ',' + right + '\n', function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
    })
};
