/*
basic GDB wrapper

gdbConfig {
  streamConfig{
    inStream
    outStream
    errStream
  }
  cwd
  exec
  stdio
  detached
}
*/
var child_process = require('child_process');
var path = require('path');

function GDBWrapper(gdbConfig) {
  this.gdb_instance = null;
  if(!gdbConfig){
    throw("Error. No configuration specified");
  }
  this.outStream = gdbConfig.streamConfig.outStream || process.stdout;
  this.inStream = gdbConfig.streamConfig.inStream || process.stdin;
  this.errStream = gdbConfig.streamConfig.errStream || process.stderr;
  this.init(gdbConfig);
}

GDBWrapper.prototype.init = function (config) {
  var exec,gdb_args;
  exec = "./"+ config.exec;
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
    this.gdb_instance.stderr.pipe(this.errStream);
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

GDBWrapper.prototype.getErrStream = function () {
  return this.errStream;
};

GDBWrapper.prototype.write = function (data) {
  try {
    this.inStream.write(data);
  } catch (e) {
    console.log("Error writing to the gdb instance");
  }
}
//not sure if the following methods are necessary
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
