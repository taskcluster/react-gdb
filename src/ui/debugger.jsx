import React from 'react'
import debuggers from '../debuggers'

/**
 * Top-level debugger component.
 *
 * This component deals with user-interface, buttons events and presenting the
 * current state. The AbstractDebugger implementation given deals with
 * interpreting the debuggers terminal instance, and the Process object given
 * when creating the AbstractDebugger subclass is responsible for multiplexing
 * stdin, stdout, stderr over a websocket.
 *
 * Created using: <Debugger debugger={dbg}/>
 * Where dbg is an instance of AbstractDebugger.
 */
let Debugger = React.createClass({
  propTypes: {
    debugger: React.PropTypes.instanceOf(debuggers.AbstractDebugger),
  },

  render() {
    //...
  },

  //TODO: This module probably have to define some redux things too...
});

// Export Debugger
export default Debugger;
