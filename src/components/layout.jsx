import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'
import Sources from './sources.jsx'
import Controls from './controls.jsx'
import styles from './layout.css'

class Layout extends React.Component {
  componentDidMount () {
    this.props.init()
  }

  render () {
    let { UIState, breaks, threads, sources } = this.props
    let { openFile, selectThread, addBreak, removeBreak,
      closeFile, fetch, next, run, stepOut, stepIn } = this.props
    let thread = UIState.get('selectedThread')
    let files = UIState.get('openedFiles')
    let data = (new Map()).withMutations((map) => {
      files.forEach((f) => {
        let file = sources.get(f)
        // XXX: `let breaks = breaks.withMutations...` won't work here!
        // Scoping problem? Why?
        let breaksList = breaks.withMutations((map) => {
          map.filter((b) => b.get('file') === f)
            .filter((b) => b.get('thread') === thread || b.get('thread') === 'all')
        }).toList().map((b) => b.get('line'))
        map.set(f, new Map({ file, breaks: breaksList }))
      })
    })
    let frame = thread ? threads.get(thread).get('frame') : null

    let sourcesList = []
    sources.forEach((value, key) => {
      sourcesList.push(<div key={key}><a href="#" onClick={() => openFile(key)}>{key}</a></div>)
    })

    let threadsList = []
    threads.forEach((value, key) => {
      threadsList.push(<div key={key}><a href="#" onClick={() => selectThread(key)}>{key}</a></div>)
    })

    let addBreakToCurrentThread = (file, pos) => {
      addBreak(file, pos, thread)
    }

    let removeBreakFromCurrentThread = (file, pos) => {
      let id = breaks.findKey((value, key) =>
        value.equals({ file, line: pos, thread }))
      removeBreak(id)
    }

    return (
      <div className={styles.wrap}>
        <div className={`${styles.column} ${styles.left}`}>
          <h1>Sources</h1>
          {sourcesList}
          <h1>Threads</h1>
          {threadsList}
        </div>
        <div className={styles.content}>
          <Sources files={files} data={data} frame={frame}
            openFile={openFile}
            closeFile={closeFile}
            fetchFile={fetch}
            removeBreak={removeBreakFromCurrentThread}
            addBreak={addBreakToCurrentThread} />
        </div>
        <div className={`${styles.column} ${styles.right}`}>
          <Controls next={() => next(thread)}
            run={() => run(thread)}
            continue={() => this.props.continue(thread)/* TODO: change name */}
            stepOut={() => stepOut(thread)}
            stepIn={() => stepIn(thread)} />
          <h1>Context</h1>
          {thread ? JSON.stringify(threads.get(thread).get('vars').toJS()) : 'no vars yet'}
          <h1>Callstack</h1>
          {thread ? JSON.stringify(threads.get(thread).get('callstack').toJS()) : 'no callstack yet'}
          <h1>Breakpoints</h1>
          {JSON.stringify(breaks.filter((b) => b.get('thread') === thread || b.get('thread') === 'all').toJS())}
        </div>
      </div>
    )
  }
}

// TODO: concretize + add actions propTypes
Layout.propTypes = {
  UIState: ImmutablePropTypes.map.isRequired,
  breaks: ImmutablePropTypes.map.isRequired,
  threads: ImmutablePropTypes.map.isRequired,
  sources: ImmutablePropTypes.map.isRequired
}

export default Layout

