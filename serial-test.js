

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


var leftSteps = 0, rightSteps = 0;
var d3 = require('d3');
var ledScale = d3.scale.linear().domain([0, 225]).range([0, 16]).clamp(true);

setInterval(function () {
	led.sendStepValues(ledScale(leftSteps), ledScale(rightSteps));
}, 1000);


setTimeout(function() {
	setInterval(function () {
		leftSteps += Math.round(Math.random() * 5);
	}, 500);

}, Math.random() * 400)

setTimeout(function() {
	setInterval(function () {
		rightSteps += Math.round(Math.random() * 5);
	}, 500);

}, Math.random() * 400)
