var GDBWrapper = require('./gdbwrapper');
var path = require('path');
/*
//Test code
var wrapperConfig = {
  exec: 'hello',
  config: {
    cwd: path.join(__dirname,"..","..")
  },
  outStream: process.stdout,
  inStream: process.stdin
}
var gdb = new GDBWrapper(wrapperConfig);
*/

module.exports = GDBWrapper;
