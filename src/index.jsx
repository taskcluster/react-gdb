import React from 'react'
import GDB from 'gdb-js'
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, compose,
  applyMiddleware, bindActionCreators } from 'redux'
import { asyncMiddleware } from './middleware/async.js'
import { promiseMiddleware } from './middleware/promise.js'
import sources from './reducers/sources.js'
import threads from './reducers/threads.js'
import breaks from './reducers/breaks.js'
import UIState from './reducers/ui-state.js'
import createActions from './actions.js'
import Layout from './components/layout.jsx'

let reducer = combineReducers({
  sources,
  threads,
  breaks,
  UIState
})

let middlewares = applyMiddleware(
  asyncMiddleware,
  promiseMiddleware
)

let enhancer = compose(
  middlewares,
  window && typeof window.devToolsExtension !== 'undefined' ?
    window.devToolsExtension() : (f) => f
)

class ReactGDB extends React.Component {
  componentWillMount () {
    this.store = createStore(reducer, enhancer)
    this.gdb = new GDB(this.props.process)
    this.sourceProvider = this.props.sourceProvider
    this.inferiorProvider = this.props.inferiorProvider
    this.actions = bindActionCreators(
      createActions(this.gdb, this.sourceProvider),
      this.store.dispatch
    )
    // Injecting actions for debugging purposes
    if (window) window.reactGDB = this.actions
    this.App = connect((state) => state, this.actions)(Layout)
    this.gdb.on('stopped', this.actions.update)
    this.gdb.on('thread-created', this.actions.addThread)
    this.gdb.on('thread-exited', this.actions.removeThread)
    if (this.inferiorProvider) {
      this.inferiorProvider.on('fork', this.actions.attachTarget)
    }
  }

  render () {
    let App = this.App

    return (
      <Provider store={this.store}>
        <App />
      </Provider>
    )
  }
}

ReactGDB.propTypes = {
  process: React.PropTypes.shape({
    stdin: React.PropTypes.object.isRequired,
    stdout: React.PropTypes.object.isRequired,
    stderr: React.PropTypes.object.isRequired
  }).isRequired,
  sourceProvider: React.PropTypes.func.isRequired,
  inferiorProvider: React.PropTypes.object
}

// XXX: `export default` won't work here
// the same way due to messed up semantics.
// It'll export `{ default: ... }` object.
module.exports = ReactGDB
