import React from 'react'
import GDB from 'gdb-js'
import { createStore, combineReducers,
  applyMiddleware, bindActionCreators } from 'redux'
import { Provider } from 'react-redux'
import { Map } from 'immutable'
import { asyncMiddleware } from './middleware/async'
import { promiseMiddleware } from './middleware/promise'
import sources from './reducers/sources'
import threads from './reducers/threads'
import breaks from './reducers/breaks'
import UIState from './reducers/ui-state'
import initActions from './actions'
import Sources from './components/sources'
import Controls from './components/controls'

let reducer = combineReducers({
  sources,
  threads,
  breaks,
  UIState
})

let createStoreWithMiddleware = applyMiddleware(
  asyncMiddleware,
  promiseMiddleware
)(createStore)

let store = createStoreWithMiddleware(reducer)

class ReactGDB extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.gdb = new GDB(this.props.process)
    this.getSource = this.props.sourceProvider
    let actions = initActions(this.gdb, this.getSource)
    let boundActions = bindActionCreators(actions, store.dispatch)
    this.actions = boundActions
    this.actions.init()
    this.gdb.on('stopped', this.actions.update)
    this.gdb.on('thread-created', this.actions.addThread)
    this.gdb.on('thread-exited', this.actions.removeThread)
  }

  render () {
    let thread = store.UIState.selectedThread
    let files = store.UIState.get('openedFiles')
    let data = (new Map()).withMutations((map) =>
      files.reduce((res, f) => {
        let file = store.sources.get(f)
        let breaks = store.breaks.withMutations((map) => {
          map.filter((b) => b.get('file') === f).toList()
            .filter((b) => b.get('thread') === thread)
            .map((b) => b.get('line'))
        })
        return res.set(f, new Map({ file, breaks }))
      }, map))
    let frame = store.threads.get(thread).get('frame')

    let sourcesList = []
    store.sources.forEach((value, key) => {
      sourcesList.push(<a onClick={() => this.actions.openFile(key)}>key</a><br />)
    })

    let threadsList = []
    store.threads.forEach((value, key) => {
      threadsList.push(<a onClick={() => this.actions.selectThread(key)}>key</a><br />)
    })

    let addBreak = (file, pos) => {
      this.actions.addBreak(file, pos, thread)
    }
    let removeBreak = (file, pos) => {
      let id = store.breaks.findKey((value, key) =>
        value.equals({ file, line: pos, thread }))
      this.actions.removeBreak(id)
    }

    return (
      <Provider store={store}>
        <div class="reactgdb-wrap">
          <div class="reactgdb-column reactgdb-left">
            <h1>Sources</h1>
            {sourcesList}
            <h1>Threads</h1>
            {threadsList}
          </div>
          <div class="reactgdb-content">
            <Sources files={files} data={data} frame={frame}
              openFile={this.actions.openFile}
              closeFile={this.actions.closeFile}
              fetchFile={this.actions.fetch}
              removeBreak={removeBreak}
              addBreak={addBreak} />
          </div>
          <div class="reactgdb-column reactgdb-right">
            <Controls next={() => this.actions.next(thread)}
              run={() => this.actions.run(thread)}
              continue={() => this.actions.continue(thread)}
              stepOut={() => this.actions.stepOut(thread)}
              stepIn={() => this.actions.stepIn(thread)} />
            <h1>Context</h1>
            {store.threads.get(thread).get('vars').toJS()}
            <h1>Callstack</h1>
            {store.threads.get(thread).get('callstack').toJS()}
            <h1>Breakpoints</h1>
            {store.breaks.filter((b) => b.get('thread') === thread).toJS()}
          </div>
        </div>
      </Provider>
    )
  }
}

ReactGDB.propTypes = {
  process: React.PropTypes.shape({
    stdin: React.PropTypes.object.isRequired,
    stdout: React.PropTypes.object.isRequired,
    stderr: React.PropTypes.object.isRequired
  }),
  sourceProvider: React.PropTypes.func.isRequired
}

export default ReactGDB
