"use strict";
var Gpio = require('pigpio').Gpio;

function InputMonitor(gpioNum, pullUpDown, inNumber, inName, inTimeout) {
    this._gpioNum = gpioNum;
    this._inNumber = inNumber;
    this._inName = inName;
    this._input = new Gpio(this._gpioNum, {
        mode: Gpio.INPUT,
        pullUpDown: pullUpDown,
        edge: Gpio.EITHER_EDGE,
        timeout: inTimeout ? 0 : inTimeout
    });
}

InputMonitor.prototype.start = function() {
    var that = this;
    this._input.on('interrupt', function(level) {
        if (typeof that._callback === 'function') {
            that._callback(that._inNumber, that._inName, level);
        }
    });
};

InputMonitor.prototype.onInputChange = function(callback) {
    this._callback = callback;
}

module.exports = InputMonitor;