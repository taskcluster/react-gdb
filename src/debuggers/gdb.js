import AbstractDebugger from './abstractdebugger'
import NotSupported from './notsupported'

/**
 * An implementation of AbstractDebugger for GDB.
 *
 * All methods and events are documented in AbstractDebugger.
 */
export default class GDB extends AbstractDebugger {
  constructor(proc) {
    super(proc)
    this.proc = proc;
    this.proc.on('exit', (code) => {
      if (code !== 0) {
        this.emit('error', new Error("gdb exited with exit code: " + code));
      }
      this.emit('terminated');
    });
  }

  async break() {
    // some implementation...
  }

  async continue() {
    //... just illustrative...
    throw new NotSupported("We would throw this if gdb didn't support break()")
  }
}

