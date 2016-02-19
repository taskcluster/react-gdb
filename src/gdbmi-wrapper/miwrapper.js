var GDBWrapper = require('./gdbwrapper'),
  OutputParser = require('./output-parser');

function MIWrapper(config,GDBWrapper) {
  this.gdb = new GDBWrapper(config);
  this.outStream = this.gdb.getOutStream();
  this.outputParser = new OutputParser(this.outStream);
  this.outputParser.parse().then(function (result) {
    //TODO:Clean up the results
    if(result.type){
      this.outStream.emit(result.type,result);
    }
  }).catch(function (error) {
    this.outStream.emit("error",error);
  });
}

MIWrapper.prototype.writeCommand = function (command) {
  this.gdb.write(command);
};

module.exports = MIWrapper;
