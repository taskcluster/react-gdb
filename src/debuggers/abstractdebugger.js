import Process from './process'
import assert from 'assert'
import events from 'events'

/**
 * Abstract class debugger wrappers must implement.
 *
 * An implementation may emit the following events:
 *  - error, when there is an error that isn't reflected in a returned promise.
 *  - terminated, when the debugger has terminated.
 */
export default class AbstractDebugger extends events.EventEmitter {
  /** Constructor expects an instance of Process */
  constructor(proc) {
    super()
    assert(proc instanceof Process, "Expected an instance of Process");
  }

  // Okay, methods below here are just illustrative, I don't know the exact
  // interface yet...

  /** Break the program execution, returns a promise */
  async break() {
    throw new Error('Not implemented');
  }

  /** Continue program execution, returns a promise */
  async continue() {
    throw new Error('Not implemented');
  }

}

