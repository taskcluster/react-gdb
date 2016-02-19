/*
  Parse output from gdb/mi output stream.
  Produces JSON objects as output
*/
var Promise = require('bluebird'),
  regexPatterns = require('./regex-patterns');

/*
  Wrap callback in a promise
*/

function streamOn(stream,event) {
  return new Promise(function(resolve, reject) {
    try{
      stream.on(event,function (arguments) {
        resolve(arguments);
      });
    }catch(error){
      reject(error);
    }
  });
}

function OutputParser(stream){
  if(!stream){
    throw("OutputParser requires a stream.");
  }
  if(!stream.on){
    throw("Unable to call \"on\" of stream object. Check object type.");
  }
  this.stream = stream;
}

OutputParser.prototype.parse = function () {
  return new Promise(function(resolve, reject) {
    streamOn(this.stream,"data").then(function(data){
      var result = {};
      //TODO: Write code for parsing
      try{
        //Test for result-record
        if(regexPatterns.resultRecord.test(data)){
          var matchedStrings = regexPatterns.resultRecord.exec(data);
          result.type = "result-record";
          if(matchedStrings){
            result.data = {
              "token":matchedStrings[0],
              "result-class":matchedStrings[1],
              "result": matchedStrings[2]
            }
          }
        }else if(regexPatterns.asyncRecord.test(data)){
          var matchedStrings = regexPatterns.asyncRecord.exec(data);
          result.type = "async-record";
          if(matchedStrings){
            result.data = {};
            result.data["token"]=matchedStrings[0];
            if(matchedStrings[1]==='*')
              result.data["type"]="exec-async-output";
            else if(matchedStrings[1]==='+')
              result.data["type"]="status-async-output";
            else{
              result.data["type"]="notify-async-output";
            }
          }
        }
        resolve(result);
      }catch(error){
        reject(error);
      }
    });
  });
};

module.exports = OutputParser;
