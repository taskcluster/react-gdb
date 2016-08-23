import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { PositionPropType, FilesPropType,
  BreaksPropType, ThreadPropType } from './common.js'
import Sources from './sources.jsx'
import Controls from './controls.jsx'
import styles from './layout.css'

class Layout extends React.Component {

  componentDidMount () {
    this.props.init()
  }

  componentWillUnmount () {
    this.props.exit()
  }

  render () {
    let { files, breaks, threads, thread, sources, position, options } = this.props
    let { selectThread, addBreak, removeBreak, interrupt, proceed,
      closeFile, next, run, stepOut, stepIn, selectPosition,
      applyBreakpointsTo } = this.props

    // TODO: split this file to separate components

    let sourcesList = []
    sources.forEach((value, key) => {
      sourcesList.push(
        <div key={key}>
          <a href='#' onClick={() => selectPosition(key)}>{key}</a>
        </div>
      )
    })

    let threadsList = []
    threads.forEach((value, key) => {
      let innerThread = value.get('thread')
      let group = value.get('group')
      let msg = `id: ${key}, group: ${group.id}` +
        (innerThread.status ? `, status: ${innerThread.status}` : '')

      threadsList.push(
        <div key={key}>
          <a href='#' onClick={() => selectThread(innerThread.id)}>
            {thread.get('thread').id === innerThread.id ? <strong>{msg}</strong> : msg}
          </a>
        </div>
      )
    })

    let breaksList = []
    breaks.forEach((value, key) => {
      breaksList.push(
        <div key={key}>
          <a href='#' onClick={() => selectPosition(value.file, value.line)}>
            file {value.file}, line {value.line}
          </a>, thread {value.thread ? value.thread.id : 'all'}
        </div>
      )
    })

    let header
    let context = []
    let callstack = []
    if (thread) {
      thread.get('context').forEach((value, key) => {
        context.push(
          <div key={key}>
            <b>{value.scope}</b> {value.type} {value.name} = {value.value}
          </div>
        )
      })

      thread.get('callstack').forEach((value, key) => {
        callstack.push(
          <div key={key}>
            <b>level {value.level}:</b><br />
            <a href='#' onClick={() => selectPosition(value.file, value.line)}>
              file {value.file}, line {value.line}
            </a>
          </div>
        )
      })

      let innerThread = thread.get('thread')
      header = <Controls next={() => next(innerThread)}
        interrupt={() => interrupt(innerThread)}
        proceed={() => proceed(innerThread)}
        stepOut={() => stepOut(innerThread)}
        stepIn={() => stepIn(innerThread)}
        status={innerThread.status} />
    } else {
      header = (
        <div>
          program is not being run yet. <a href='#' onClick={() => run()}>RUN it!</a>
        </div>
      )
    }

    let addBreakToThread = (file, pos) => {
      options.get('breakpointsAppliedTo') === 'thread'
        ? addBreak(file, pos, thread.get('thread')) : addBreak(file, pos)
    }

    return (
      <div className={styles.wrap}>
        <div className={`${styles.column} ${styles.left}`}>
          <h1>Sources</h1>
          {sourcesList}
          <h1>Threads</h1>
          {threadsList}
          <h1>Options</h1>
          <div>
            Apply breakpoints to:<br />
            <input type='radio' name='breakpoint_apply'
              checked={options.get('breakpointsAppliedTo') === 'thread'}
              onChange={() => applyBreakpointsTo('thread')} />to specific thread<br />
            <input type='radio' name='breakpoint_apply' value='to all threads'
              checked={options.get('breakpointsAppliedTo') === 'all'}
              onChange={() => applyBreakpointsTo('all')} />to all threads<br />
          </div>
        </div>
        <div className={styles.content}>
          <Sources files={files}
            frame={thread ? thread.get('thread').frame : null}
            position={position}
            selectPosition={selectPosition}
            closeFile={closeFile}
            removeBreak={removeBreak}
            addBreak={addBreakToThread} />
        </div>
        <div className={`${styles.column} ${styles.right}`}>
          <h1>Controls</h1>
          {header}
          <h1>Context</h1>
          {thread ? context : 'no thread selected'}
          <h1>Callstack</h1>
          {thread ? callstack : 'no thread selected'}
          <h1>Breakpoints</h1>
          {breaksList.length ? breaksList : 'no breakpoints yet'}
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  files: FilesPropType.isRequired,
  breaks: BreaksPropType.isRequired,
  thread: ThreadPropType,
  threads: ImmutablePropTypes.mapOf(ThreadPropType).isRequired,
  sources: ImmutablePropTypes.mapOf(React.PropTypes.string).isRequired,
  position: PositionPropType,
  init: React.PropTypes.func.isRequired,
  exit: React.PropTypes.func.isRequired,
  addBreak: React.PropTypes.func.isRequired,
  removeBreak: React.PropTypes.func.isRequired,
  run: React.PropTypes.func.isRequired,
  proceed: React.PropTypes.func.isRequired,
  interrupt: React.PropTypes.func.isRequired,
  stepIn: React.PropTypes.func.isRequired,
  stepOut: React.PropTypes.func.isRequired,
  next: React.PropTypes.func.isRequired,
  closeFile: React.PropTypes.func.isRequired,
  selectThread: React.PropTypes.func.isRequired,
  selectPosition: React.PropTypes.func.isRequired,
  applyBreakpointsTo: React.PropTypes.func.isRequired
}

export default Layout

