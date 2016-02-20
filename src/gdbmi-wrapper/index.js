var GDBWrapper = require('./gdbwrapper');
var path = require('path');
var MIWrapper = require('./miwrapper');

//Test code -- works
var wrapperConfig = {
  exec: 'hello',
  cwd: path.join(__dirname,"..",".."),
  streamConfig: {
    inStream: process.stdin,
    outStream: process.stdout,
    errStream: process.stderr
  }
};

var gdb = new GDBWrapper(wrapperConfig);
module.exports = MIWrapper;