

// var SerialManager = require('./serialmanager');


// var serial = new SerialManager();

// serial.initSerial();
// serial.startSerial();

var LedManager = require('./led-manager');
var led = new LedManager();

led.initSerial();



var serialPort = require("serialport");
serialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});


setInterval(function() {
    led.sendStepValues(Math.floor(Math.random() * 19), Math.floor(Math.random() * 19));
}, 5000);