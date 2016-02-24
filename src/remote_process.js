let child_process = require('child_process');
let assert = require('assert');
let util = require('util');
let EventEmitter = require('events');
let through2 = require('through2');

/*
  Methods currently supported
  spawn
  Methods to add
  exec
  execFile
  fork
*/

class RemoteProcess extends EventEmitter{
  constructor(cmd,args,config){
    super();
    assert(cmd !=null);
    try{
      this.proc = child_process.spawn(cmd,args,config);
    }catch(e){
      throw(e);
    }

    assert(this.proc.stdin);
    assert(this.proc.stdout);
    /*
      Stream buffering
    */
    this.inbuff = '';
    this.outbuff = '';
    this.errbuff = '';
    this.max_inbuff_size = this.proc.stdin._writableState.highWaterMark; //16k
    this.max_outbuff_size = this.proc.stdout._readableState.highWaterMark;
    // TODO: Do this for stderr
    this.max_size = config.max_size || 16 * 1024;

    this.stdoutPaused = false;
    this.stderrPaused = false;

    this.configStreams();
  }

  configStreams(){

    let self = this;
    /*
      stream1 -> websocket -> stream2

      This does the job of stream2
      It checks the internal buffer of stdin of the sub_process and if
      needed stores chunks in its own buffer and emits a req_pause event.

      To resume, the drain event is emitted.

      If the buffer grows bigger than the max size an out_of_bounds event
      is emitted.
    */
    this.stdin = through2((chunk,enc,callback)=>{
      var cursize = self.proc.stdin._writableState.getBuffer().length,
        prev = self.inbuff;
      self.inbuff = self.inbuff.concat(chunk);
      if(self.inbuff.length > self.max_size ){
        self.emit('out_of_bounds');//check if the buffer has built up too much
        self.inbuff = prev; //Discard newest input
      }
      if(cursize + self.inbuff.length > self.max_inbuff_size){
        self.emit('req_pause');
      }else{
        self.stdin.push(self.inbuff);
      }

      self.proc.stdin.on('drain',()=>{
        if(self.inbuff!=='')
          self.stdin.push(self.inbuff);
        self.emit('drain');
      });
      callback();
    });

    /*
      Initial idea:
      client stops reading from stdout but sub_process is still
      writing to stdout (use boolean to track). The remote_process#stdout
      writes this to outbuff, as long as the size is less than the max size.
      When the client resumes reading the buffer is pushed to the client.

      Should work the same for stderr.
    */

    this.stdout = through2((chunk,enc,callback)=>{
      // TODO: Figure this out somehow
      var prev = self.outbuff;
      self.outbuff = self.outbuff.concat(chunk);
      if(!self.stdoutPaused){
        self.stdout.push(self.outbuff);
        self.outbuff = '';
      }
      else if(self.outbuff.length > self.max_size){
        self.emit('out_of_bounds');
        self.outbuff = prev;//Stop the buffer from growing any further
      }
      callback();
    });

    this.stderr = through2((chunk,enc,callback)=>{
      // TODO: Figure this out somehow
      var prev = self.errbuff;
      self.errbuff = self.errbuff.concat(chunk);
      if(!self.stdoutPaused){
        self.stdout.push(self.errbuff);
        self.errbuff = '';
      }
      else if(self.errbuff.length > self.max_size){
        self.emit('out_of_bounds');
        self.errbuff = prev;//stop the buffer from growing any further
      }
      callback();
    });

    this.stdin.pipe(this.proc.stdin);
    this.proc.stdout.pipe(this.stdout);
    if(this.proc.stderr)
      this.proc.stderr.pipe(this.stderr);
      
  }

  static spawn(cmd,args,config){
    if(this instanceof RemoteProcess === false)
      return new RemoteProcess(cmd,args,config);
  }

  /*
    Support for suggested protocol
  */

  pauseStdout(){
    this.stdoutPaused = true;
  }

  resumeStdout(){
    this.stdoutPaused = false;
  }

  pauseStderr(){
    this.stderrPaused = true;
  }

  resumeStderr(){
    this.stderrPaused = false;
  }

}

module.exports = RemoteProcess;
