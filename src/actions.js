import { bindActionCreators } from 'redux'
import { ASYNC } from './middleware/async.js'
import { PROMISE } from './middleware/promise.js'
import { INIT, UPDATE_THREAD, FETCH_FILE, RUN, PROCEED, SELECT_POSITION,
  STEP_IN, STEP_OUT, NEXT, OPEN_FILE, INTERRUPT, APPLY_BREAKS_TO,
  CLOSE_FILE, SELECT_THREAD, ADD_THREAD, GET_SOURCES, UPDATE_ALL_THREADS,
  REMOVE_THREAD, ADD_BREAK, REMOVE_BREAK } from './constants.js'

export default (gdb, sourceProvider, attachOnFork, dispatch, getState) => {
  let actions = {}

  actions.getSources = () => ({
    type: GET_SOURCES,
    [PROMISE]: gdb.sourceFiles({ pattern: sourceProvider.filter })
  })

  actions.init = () => ({
    type: INIT,
    [ASYNC]: async () => {
      await gdb.init()
      await gdb.enableAsync()
      if (attachOnFork) await gdb.attachOnFork()
      dispatch(actions.getSources())
    }
  })

  actions.exit = () => ({
    type: EXIT,
    [PROMISE]: gdb.exit()
  })

  actions.updateThread = (thread) => ({
    type: UPDATE_THREAD,
    inline: true,
    thread,
    [ASYNC]: async () => {
      let callstack
      let context

      if (thread.status === 'stopped') {
        let frame = thread.frame

        try {
          callstack = await gdb.callstack(thread)
          context = await gdb.context(thread)
        } catch (e) {
          let msg = 'Error while examining stack info. Probably segmentation fault.'
          console.error(new Error(msg))
        }

        if (getState().UIState.get('selectedThread') === thread.id) {
          dispatch(actions.selectPosition(frame.file, frame.line))
        }
      }

      return { callstack, context }
    }
  })

  actions.updateAllThreads = () => ({
    type: UPDATE_ALL_THREADS,
    [ASYNC]: async () => {
      let threads = await gdb.threads()
      console.log(threads)
      threads.forEach((t) => dispatch(actions.updateThread(t)))
    }
  })

  actions.fetchFile = (file) => ({
    type: FETCH_FILE,
    file,
    [PROMISE]: sourceProvider.fetch(file)
  })

  actions.addBreak = (file, pos, thread) => ({
    type: ADD_BREAK,
    [PROMISE]: gdb.addBreak(file, pos, thread)
  })

  actions.removeBreak = (breakpoint) => ({
    type: REMOVE_BREAK,
    breakpoint,
    [PROMISE]: gdb.removeBreak(breakpoint)
  })

  actions.run = () => ({
    type: RUN,
    [PROMISE]: gdb.run()
  })

  actions.proceed = (thread) => ({
    type: PROCEED,
    thread,
    [PROMISE]: gdb.proceed(thread)
  })

  actions.interrupt = (thread) => ({
    type: INTERRUPT,
    [PROMISE]: gdb.interrupt(thread)
  })

  actions.stepIn = (thread) => ({
    type: STEP_IN,
    [PROMISE]: gdb.stepIn(thread)
  })

  actions.stepOut = (thread) => ({
    type: STEP_OUT,
    [PROMISE]: gdb.stepOut(thread)
  })

  actions.next = (thread) => ({
    type: NEXT,
    [PROMISE]: gdb.next(thread)
  })

  actions.openFile = (file) => {
    if (!getState().sources.get(file)) dispatch(actions.fetchFile(file))
    return { type: OPEN_FILE, file }
  }

  actions.closeFile = (file) => {
    let state = getState().UIState
    if (state.get('selectedPosition').get('file') === file) {
      let files = state.get('openedFiles').toArray()
      let index = files.indexOf(file)
      dispatch(actions.selectPosition(files[index - 1] || files[index + 1]))
    }
    return { type: CLOSE_FILE, file }
  }

  actions.applyBreakpointsTo = (scope) => ({
    type: APPLY_BREAKS_TO,
    scope
  })

  actions.selectThread = (id) => {
    let thread = getState().threads.get(id)
    let frame = thread ? thread.get('thread').frame : null
    if (frame) dispatch(actions.selectPosition(frame.file, frame.line))
    return { type: SELECT_THREAD, id }
  }

  actions.selectPosition = (file, line) => {
    if (file && !getState().UIState.get('openedFiles').has(file)) {
      dispatch(actions.openFile(file))
    }
    return  { type: SELECT_POSITION, file, line }
  }

  actions.addThread = (thread) => {
    if (!getState().UIState.get('selectedThread')) {
      dispatch(actions.selectThread(thread.id))
    }
    return { type: ADD_THREAD, thread }
  }

  actions.removeThread = (thread) => {
    let state = getState()
    if (state.UIState.get('selectedThread') === thread.id) {
      let threads = state.threads.keySeq().toArray()
      if (threads.length > 1) {
        let index = threads.indexOf(thread.id)
        dispatch(actions.selectThread(threads[index - 1] || threads[index + 1]))
      }
    }
    return { type: REMOVE_THREAD, thread }
  }

  actions.attachTarget = (pid) => ({
    type: ATTACH_TARGET,
    [PROMISE]: gdb.attach(pid)
  })

  return bindActionCreators(actions, dispatch)
}

