import React from 'react'
import { GDB } from 'gdb-js'
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
    let { process, sourceProvider, attachOnFork,
      inferiorProvider, objfileFilter } = this.props
    let gdb = new GDB(process)
    let store = createStore()
    let selector = createSelector()
    let actions = createActions(gdb, sourceProvider,
      attachOnFork, store.dispatch, store.getState)
    let App = connect(selector, actions)(Layout)

    let update = (data) => {
      if (data.thread) {
        actions.updateThread(data.thread)
      } else {
        actions.updateAllThreads()
      }
    }

    gdb.on('stopped', update)
    gdb.on('running', update)
    gdb.on('thread-created', actions.addThread)
    gdb.on('thread-exited', actions.removeThread)

    // Let's update source files list when new objfile is loaded into
    // GDB (e.g. `execl` calls or new target is attached).
    let objfiles = []
    gdb.on('new-objfile', (path) => {
      if(path.match(objfileFilter) && !objfiles.includes(path)) {
        actions.getSources()
      } else {
        objfiles.push(path)
      }
    })

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
    filter: React.PropTypes.string.isRequired
  }).isRequired,
  inferiorProvider: React.PropTypes.instanceOf(EventEmitter),
  objfileFilter: React.PropTypes.instanceOf(RegExp).isRequired,
  attachOnFork: React.PropTypes.bool
}

// XXX: `export default` won't work here
// the same way due to messed up semantics.
// It'll export `{ default: ... }` object.
module.exports = ReactGDB

