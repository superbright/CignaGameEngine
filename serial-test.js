

var SerialManager = require('./serialmanager');


var serial = new SerialManager();

serial.initSerial();
serial.startSerial();



var serialPort = require("serialport");
serialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});