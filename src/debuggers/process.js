import events from 'events'

//TODO: Maybe this should be an abstract class with subclasses.


/**
 * Creates a simple wrapper for a process, whether it is remote or local.
 *
 * Any instance of this class has 3 properties: stdin, stdout and stderr.
 * And will emit the event: "exit" with exit code when the process exits.
 *
 * When running locally we can easily create a Process object from an instance
 * ChildProcess. When running in the browser we can make instance by demuxing
 * streaming from a websocket.
 */
export default class Process extends events.EventEmitter {
  /**
   * Construct a process wrapper given 3 streams and an event emitter that will
   * emit 'exit' with exit code.
   */
  construct(stdin, stdout, stderr, emitter) {
    super()
    assert(stdin, 'stdin stream must be given');
    assert(stdout, 'stdout stream must be given');
    assert(stderr, 'stderr stream must be given');
    assert(emitter instanceof events.EventEmitter);
    this.stdin = stdin;
    this.stdout = stdout;
    this.stderr = stderr;
    emitter.once('exit', (code) => {
      this.emit('exit', code);
    });
  }
}


