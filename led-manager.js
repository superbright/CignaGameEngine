
var _ = require('lodash');

var serialPortString = '/dev/tty.usbmodem590551';
var baudRate = 57600;

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
        // parser: sp.parsers.readline("\n"),
        // buffersize: 64,
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


var lastLeft, lastRight;
LedManager.prototype.sendStepValues = function(left, right) {

    if(!opened) {
        throw new Error('Must open serial port first!');
    }

    if(_.isUndefined(right)) {
        right = 0;
    }

    left = Math.round(left);
    right = Math.round(right);

    console.log(left, right);

    // if(left === lastLeft && right === lastRight) {
    //     return;
    // }

    
    serialPort.write(left +',' + right + '\n');        
    
    lastLeft = left;
    lastRight = right;




    // serialPort.write(left + '\t' + right + '\r\n', function(err, results) {
    //     console.log('err ' + err);
    //     console.log('results ' + results);
    // })
};
