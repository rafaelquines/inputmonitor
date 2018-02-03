"use strict";

if ((process.env.NODE_ENV != "development") &&
    (process.env.NODE_ENV != "production")) {
    console.error("Invalid environment");
    console.error("Expected environment: development or production");
    console.error("Current environment: ", process.env.NODE_ENV);
    process.exit(1);
}

var Gpio = process.env.NODE_ENV === 'development' ? require('@rafaelquines/pigpio-mock').Gpio : require('pigpio').Gpio;

function InputMonitor(gpioNum, pullUpDown, inNumber, inName, inTimeout) {
    if ((process.env.NODE_ENV != "development") &&
        (process.env.NODE_ENV != "testing") &&
        (process.env.NODE_ENV != "staging") &&
        (process.env.NODE_ENV != "production")) {
        console.error("Invalid environment");
        console.error("Expected environment: development, testing, staging or production");
        console.error("Current environment: ", process.env.NODE_ENV);
        process.exit(1);
    }
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
    this._input.digitalWrite(level);
}

module.exports = InputMonitor;