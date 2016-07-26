import React from 'react'
import GDB from 'gdb-js'
import { Provider, connect } from 'react-redux'
import { Writable, Readable } from 'stream'
import { EventEmitter } from 'events'
import createStore from './store.js'
import createActions from './actions.js'
import createSelector from './selector.js'
import Layout from './components/layout.jsx'

class ReactGDB extends React.Component {
  componentWillReceiveProps () {
    console.warn('Passing new props. ReactGDB will be re-rendered.')
  }

  render () {
    let { process, sourceProvider, inferiorProvider } = this.props
    let { fetch: fetchFile, basePath } = sourceProvider
    let gdb = new GDB(process)
    let store = createStore()
    let selector = createSelector()
    let actions = createActions(gdb, fetchFile, basePath, store.dispatch)
    let App = connect(selector, actions)(Layout)

    gdb.on('stopped', actions.update)
    gdb.on('thread-created', actions.addThread)
    gdb.on('thread-exited', actions.removeThread)
    if (inferiorProvider) inferiorProvider.on('fork', actions.attachTarget)

    // Injecting actions for debugging purposes
    if (window) window.reactGDB = actions

    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

ReactGDB.propTypes = {
  process: React.PropTypes.shape({
    stdin: React.PropTypes.instanceOf(Writable).isRequired,
    stdout: React.PropTypes.instanceOf(Readable).isRequired,
    stderr: React.PropTypes.instanceOf(Readable).isRequired
  }).isRequired,
  sourceProvider: React.PropTypes.shape({
    fetch: React.PropTypes.func.isRequired,
    basePath: React.PropTypes.string.isRequired
  }),
  inferiorProvider: React.PropTypes.instanceOf(EventEmitter)
}

// XXX: `export default` won't work here
// the same way due to messed up semantics.
// It'll export `{ default: ... }` object.
module.exports = ReactGDB

