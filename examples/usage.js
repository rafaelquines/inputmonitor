"use strict";
var InputMonitor = require('inputmonitor');

// Define constants
var debounce = 15;
var gpioNum = 19;
var inputName = 'Input1';
var gpioNum = 1;

// Function to get input status changed
function inputStatusChanged(err, number, name, value) {
    console.log(name + '[' + number + '] (' + (value ? 'ACTIVED' : 'DEACTIVED') + ')');
}

// Initialize InputMonitor with GPIO number, a number, a name and a debounce time
var inputMonitor = new InputMonitor(gpioNum, gpioNum, inputName, debounce);

// Set funcion callback
inputMonitor.onInputChange(inputStatusChanged);

// Start watch
inputMonitor.start()
