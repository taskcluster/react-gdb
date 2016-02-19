/*
basic GDB wrapper
*/
var child_process = require('child_process');
var path = require('path');

function GDBWrapper(config) {
  this.gdb_instance = null;
  if(!config){
    throw("Error. No configuration specified");
  }
  this.outStream = config.outStream || process.stdout;
  this.inStream = config.inStream || process.stdin;
  this.errStream = config.errStream || process.stderr;
  this.init(config.exec,config.config);
}

GDBWrapper.prototype.init = function (exec,config) {
  var exec,gdb_args;
  exec = "./"+exec;
  gdb_args = ["--interpreter=mi","-q"].concat(exec);
  if(config){
    config.cwd = config.cwd || path.join(__dirname,'');
    config.stdio = config.stdio || ['pipe','pipe','pipe'];
    config.detached = config.detached || false;
  }else{
    config = {
      cwd: path.join(__dirname,'..'),
      stdio: ['pipe','pipe','ignore'],
      detached: false
    };
  }
  try {
    this.gdb_instance = child_process.spawn('gdb',gdb_args,config);
    this.gdb_instance.stdout.pipe(this.outStream);
    this.inStream.pipe(this.gdb_instance.stdin);
  } catch (e) {
    console.log("Error starting gdb");
    throw(e);
  }
};

GDBWrapper.prototype.getInStream = function () {
  return this.inStream;
};

GDBWrapper.prototype.getOutStream = function () {
  return this.outStream;
};

GDBWrapper.prototype.write = function (data) {
  try {
    this.inStream.write(data);
  } catch (e) {
    console.log("Error writing to the gdb instance");
  }
}

GDBWrapper.prototype.onOutData = function (cb) {
  this.outStream.on("data",cb);
};

GDBWrapper.prototype.onErrData = function (cb) {
  this.errStream.on("data",cb);
};

GDBWrapper.prototype.onError = function (cb) {
  this.gdb_instance.on("error",cb);
};

GDBWrapper.prototype.onExit = function (cb) {
  this.gdb_instance.on("exit",cb);
  console.log("GDB Instance exited");
};

GDBWrapper.prototype.onClose = function (cb) {
  this.gdb_instance.on("close",cb);
  console.log("GDB Instance closed");
};

module.exports = GDBWrapper;
