"use strict";
var Gpio = require('onoff').Gpio;

Gpio.prototype.watchFilter = function (callback, debounce) {
    const that = this;
    if (!this.watchFilterData) {
        const d = this.watchFilterData = {
            oldValue: undefined,
            timer: undefined,
            listener: []
        };
        this.watch(function (err, value) {
            if (err) {
                if (d.listener.length == 0) throw err;
                d.listener.forEach(l => l.call(that, err, value));
                return;
            }
            clearTimeout(d.timer);
            d.timer = setTimeout(function () {
                if (d.oldValue === value) {
                    return;
                }
                d.oldValue = value;
                d.listener.forEach(l => l.call(that, undefined, value));
            }, debounce);
        });
    }
    this.watchFilterData.listener.push(callback);
};

function InputMonitor(pin, number, name, debounce) {
    this._pin = pin;
    this._number = number;
    this._name = name;
    this._debounce = debounce ? 0 : debounce;
    this._input = new Gpio(pin, 'in', 'both');
}

InputMonitor.prototype.start = function() {
    var that = this;
    this._input.watchFilter(function (err, value) {
        if(typeof that._callback === 'function')
            that._callback(err, that._number, that._name, value);
    }, this._debounce);
};

InputMonitor.prototype.onInputChange = function(callback) {
    this._callback = callback;
}

module.exports = InputMonitor;
