import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { FramePropType, FilesPropType, BreaksPropType } from './common.js'
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
    let { files, thread, threads, sources, frame } = this.props
    let { openFile, selectThread, addBreak, removeBreak, interrupt, proceed,
      closeFile, fetch, next, run, stepOut, stepIn, focus } = this.props

    let threadId = thread ? thread.get('id') : null

    // TODO: split this file to separate components

    let sourcesList = []
    sources.forEach((value, key) => {
      sourcesList.push(
        <div key={key}>
          <a href="#" onClick={() => openFile(key)}>
            {key}
          </a>
        </div>
      )
    })

    let threadsList = []
    threads.forEach((value, key) => {
      let clickHandler = () => {
        let frame = value.get('frame')
        selectThread(key)
        focus(frame.get('file'), frame.get('line'))
      }

      threadsList.push(
        <div key={key}>
          <a href="#" onClick={clickHandler}>
            {`id: ${key}, group: ${value.get('gid')}, status: ${value.get('status')}`}
          </a>
        </div>
      )
    })

    let context = []
    let callstack = []
    let breaks = []
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
            <a href="#" onClick={() => { focus(value.fullname, parseInt(value.line, 10)) }}>
              file {value.fullname}, line {value.line}
            </a>
          </div>
        )
      })

      thread.get('breaks').forEach((value, key) => {
        breaks.push(
          <div key={key}>
            <a href="#" onClick={() => { focus(value.get('file'), value.get('line')) }}>
              file {value.get('file')}, line {value.get('line')}
            </a>, thread {value.get('thread')}
          </div>
        )
      })
    }

    // If the third argument is `true`, break is added to all threads.
    let addBreakToCurrentThread = (file, pos, addToAll) => {
      addToAll ? addBreak(file, pos) : addBreak(file, pos, threadId)
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
          <Sources files={files}
            threadFrame={thread ? thread.get('frame') : null}
            focusedFrame={frame}
            openFile={openFile}
            closeFile={closeFile}
            fetchFile={fetch}
            removeBreak={removeBreak}
            addBreak={addBreakToCurrentThread} />
        </div>
        <div className={`${styles.column} ${styles.right}`}>
          <Controls next={() => next(threadId)}
            interrupt={() => interrupt(threadId)}
            proceed={() => thread ? proceed(threadId) : run()}
            stepOut={() => stepOut(threadId)}
            stepIn={() => stepIn(threadId)}
            status={thread ? thread.get('status') : 'idle'} />
          <h1>Context</h1>
          {thread ? context : 'no thread selected'}
          <h1>Callstack</h1>
          {thread ? callstack : 'no thread selected'}
          <h1>Breakpoints</h1>
          {thread ? breaks : 'no thread selected'}
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  files: FilesPropType.isRequired,
  thread: ImmutablePropTypes.mapContains({
    id: React.PropTypes.number.isRequired,
    breaks: BreaksPropType.isRequired,
    callstack: ImmutablePropTypes.listOf(
      React.PropTypes.shape({
        fullname: React.PropTypes.string.isRequired,
        line: React.PropTypes.number.isRequired
      })
    ).isRequired,
    context: ImmutablePropTypes.listOf(
      React.PropTypes.shape({
        scope: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.string.isRequired
      })
    ).isRequired,
    status: React.PropTypes.string.isRequired,
    frame: FramePropType.isRequired
  }),
  threads: ImmutablePropTypes.mapOf(
    ImmutablePropTypes.contains({
      status: React.PropTypes.string.isRequired,
      gid: React.PropTypes.string.isRequired
    })
  ).isRequired,
  sources: ImmutablePropTypes.map.isRequired,
  frame: FramePropType,
  init: React.PropTypes.func.isRequired,
  exit: React.PropTypes.func.isRequired,
  fetch: React.PropTypes.func.isRequired,
  addBreak: React.PropTypes.func.isRequired,
  removeBreak: React.PropTypes.func.isRequired,
  run: React.PropTypes.func.isRequired,
  proceed: React.PropTypes.func.isRequired,
  interrupt: React.PropTypes.func.isRequired,
  stepIn: React.PropTypes.func.isRequired,
  stepOut: React.PropTypes.func.isRequired,
  next: React.PropTypes.func.isRequired,
  openFile: React.PropTypes.func.isRequired,
  closeFile: React.PropTypes.func.isRequired,
  selectThread: React.PropTypes.func.isRequired,
  focus: React.PropTypes.func.isRequired
}

export default Layout

