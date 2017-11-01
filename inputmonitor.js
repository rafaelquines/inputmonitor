"use strict";
var Gpio = process.env.NODE_ENV !== 'production' ? require('pigpio-mock').Gpio : require('pigpio').Gpio;

function InputMonitor(gpioNum, pullUpDown, inNumber, inName, inTimeout) {
    this._gpioNum = gpioNum;
    this._inNumber = inNumber;
    this._inName = inName;
    this._inTimeout = inTimeout ? inTimeout : 0;
    this._input = new Gpio(this._gpioNum, {
        mode: Gpio.INPUT,
        pullUpDown: pullUpDown,
        edge: Gpio.EITHER_EDGE
            // ,
            // timeout: inTimeout ? inTimeout : 0
    });
    this._lastInterruptTime = 0;
    this._isFunction = false;
}

InputMonitor.prototype.start = function() {
    var that = this;
    this._input.on('interrupt', function(level) {
        if (that._isFunction) {
            var interruptTime = Date.now();
            if ((interruptTime - that._lastInterruptTime) >= that._inTimeout) {
                that._callback(that._inNumber, that._inName, level);
            }
            that._lastInterruptTime = interruptTime;
        }
    });
};

InputMonitor.prototype.onInputChange = function(callback) {
    this._isFunction = (typeof callback === 'function');
    this._callback = callback;
}

InputMonitor.prototype.setStatus = function(level) {
    this.Gpio.digitalWrite(level);
}

module.exports = InputMonitor;