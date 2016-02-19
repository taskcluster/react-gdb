//TODO: Regex patterns to parse output
//TODO: Build all primitive regex patterns

//REALLY NOT SURE ABOUT THESE!! PLEASE TEST

var resultClass = new RegExp(/(done|running|connected|error|exit)/),
  asyncClass = new RegExp(/(stopped)/),
  variable = new RegExp(/([\w]+)/),
  token = new RegExp(/([\d]+)/),
  constant = new RegExp(/([\w\-]+)/),
  tupleBase = new RegExp(/\{([,\w\s=]*)\}/),
  listBase = new RegExp(/\[([,\w\s=]*)\]/),
  valueBase = new RegExp(constant.source+"|"+listBase.source+"|"+tupleBase.source);

var result = new RegExp(variable.source+ "\s*=\s*" + valueBase.source);
var resultRecord = new RegExp(token.source+"\s*\^\s*"+resultClass.source+"\s*([\w\W\s]*)");

var asyncOutput = new RegExp(asyncClass.source + "\s*(,"+result.source+")*"),
  execAsyncOutput = new RegExp(token.source+"\s*([\*])\s*"+asyncOutput.source),
  statusAsyncOutput = new RegExp(token.source+"\s*([\+])\s*"+asyncOutput.source),
  notifyAsyncOutput = new RegExp(token.source+"\s*([=])\s*"+asyncOutput.source);

var asyncRecord = new RegExp(execAsyncOutput.source+"|"
  +statusAsyncOutput.source+"|"+notifyAsyncOutput.source);

module.exports = {
  resultRecord: resultRecord,
  asyncRecord: asyncRecord
}
