/*
This class connects the gdb streams to the multiplexed
websocket.
*/

var GDBWrapper = require('./gdbwrapper'),
  Multiplexer = require('websocket-multiplexer'),
  wsStream = require('websocket-stream'),
  Promise = require('bluebird');

function GDBMultiplexer(websocket){
  if(!websocket)
    throw("No websocket passed to multiplexer");
  this.multiplexer = new Multiplexer({socket: websocket});
  this.outputChannel = this.multiplexer.channel('out-chan');
  this.errorChannel = this.multiplexer.channel('err-chan');
  this.inputChannel = this.multiplexer.channel('in-chan');
  this.gdb = new GDBWrapper(gdbConfig);
  this.gdbOutStream = this.gdb.getOutStream();
  this.gdbInStream = this.gdb.getInStream();
  this.gdbErrStream = this.gdb.getErrStream();
}
//output stream functions
GDBMultiplexer.prototype.outStreamData = function () {
  var outputChannel = this.outputChannel;
  return new Promise(function(resolve, reject) {
    this.gdbOutStream.on('data',function (data) {
      return resolve(data,outputChannel);
    });
  });
};

//TODO:This should ideally be in reject.
//Find a way to move it there
GDBMultiplexer.prototype.outStreamError = function () {
  var outputChannel = this.outputChannel;
  return new Promise(function(resolve, reject) {
    this.gdbOutStream.on('error',function (error) {
      return resolve(error,outputChannel);
    });
  });
};

GDBMultiplexer.prototype.outStreamEnd = function () {
  var outputChannel = this.outputChannel;
  return new Promise(function(resolve, reject) {
    this.gdbOutStream.on('end',function(){
      return resolve(outputChannel);
    });
  });
};

GDBMultiplexer.prototype.outStreamClose = function () {
  var outputChannel = this.outputChannel;
  return new Promise(function(resolve, reject) {
    this.gdbOutStream.on('close',function () {
      return resolve(outputChannel);
    });
  });
};

//Error stream functions
GDBMultiplexer.prototype.errStreamData = function () {
  var errorChannel = this.errorChannel;
  return new Promise(function(resolve, reject) {
    this.gdbErrStream.on('data',function(data){
      resolve(data,errorChannel);
    });
  });
};

//TODO: This should be in a reject.
GDBMultiplexer.prototype.errStreamError = function () {
  var errorChannel = this.errorChannel;
  return new Promise(function (resolve,reject) {
    this.gdbErrStream.on('error',function (error) {
      return resolve(error,errorChannel);
    });
  });
};

GDBMultiplexer.prototype.errStreamClose = function () {
  var errorChannel = this.errorChannel;
  return new Promise(function (resolve,reject) {
    this.gdbErrStream.on('close',function () {
      return resolve(errorChannel);
    });
  });
};

GDBMultiplexer.prototype.errStreamEnd = function () {
  var errorChannel = this.errorChannel;
  return new Promise(function (resolve,reject) {
    this.gdbErrStream.on('end',function () {
      return resolve(errorChannel);
    });
  });
};

//Input stream functions
//Expose event and gdb instance
GDBMultiplexer.prototype.inputListener = function (event) {
  var inputChannel = this.inputChannel,
    gdb = this.gdb;
  return new Promise(function(resolve, reject) {
    inputChannel.addEventListener(event,function(evt){
      try{
        return resolve(evt,gdb);
      }catch(error){
        return reject(error);
      }
    });
  });
};

module.exports = GDBMultiplexer;
