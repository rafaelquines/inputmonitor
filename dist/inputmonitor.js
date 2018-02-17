"use strict";var isRpi=require("detect-rpi"),Gpio=isRpi()?require("pigpio").Gpio:require("@rafaelquines/pigpio-mock").Gpio;function InputMonitor(i,t,n,o,e){this._gpioNum=i,this._inNumber=n,this._inName=o,this._inTimeout=e||0,this._input=new Gpio(this._gpioNum,{mode:Gpio.INPUT,pullUpDown:t,edge:Gpio.EITHER_EDGE}),this._lastInterruptTime=0,this._isFunction=!1}InputMonitor.prototype.start=function(){var i=this;this._input.on("interrupt",function(t){if(i._isFunction){var n=Date.now();n-i._lastInterruptTime>=i._inTimeout&&i._callback(i._inNumber,i._inName,t),i._lastInterruptTime=n}})},InputMonitor.prototype.onInputChange=function(i){this._isFunction="function"==typeof i,this._callback=i},InputMonitor.prototype.setStatus=function(i){this._input.digitalWrite(i)},module.exports=InputMonitor;