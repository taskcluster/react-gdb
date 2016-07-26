import { bindActionCreators } from 'redux'
import { ASYNC } from './middleware/async.js'
import { PROMISE } from './middleware/promise.js'
import { INIT, UPDATE, FETCH, RUN, PROCEED, FOCUS,
  STEP_IN, STEP_OUT, NEXT, OPEN_FILE, INTERRUPT,
  CLOSE_FILE, SELECT_THREAD, ADD_THREAD, GET_SOURCES,
  REMOVE_THREAD, ADD_BREAK, REMOVE_BREAK } from './constants.js'

export default (gdb, fetchFile, basePath, dispatch) => {
  let getSources = () => ({
    type: GET_SOURCES,
    [ASYNC]: async () => {
      return (await gdb.sourceFiles())
        .filter((f) => f.fullname.startsWith(basePath))
    }
  })

  let init = () => ({
    type: INIT,
    [ASYNC]: async () => {
      await gdb.init()
      await gdb.enableAsync()
      dispatch(getSources())
    }
  })

  let exit = () => ({
    type: EXIT,
    [PROMISE]: gdb.exit()
  })

  let update = (data) => ({
    type: UPDATE,
    inline: true,
    [ASYNC]: async () => {
      // TODO: below should be done by gdb-js
      let thread = parseInt(data['thread-id'], 10)
      let callstack = await gdb.callstack(thread)
      let context = await gdb.context(thread)
      let filename = data.frame.fullname
      let line = parseInt(data.frame.line, 10)
      return { thread, callstack, context, filename, line }
    }
  })

  let fetch = (file) => ({
    type: FETCH,
    file,
    [PROMISE]: fetchFile(file)
  })

  let addBreak = (file, pos, thread) => ({
    type: ADD_BREAK,
    [PROMISE]: gdb.addBreak(file, pos, thread)
  })

  let removeBreak = (id) => ({
    type: REMOVE_BREAK,
    id,
    [PROMISE]: gdb.removeBreak(id)
  })

  let run = () => ({
    type: RUN,
    [PROMISE]: gdb.run()
  })

  let proceed = (thread) => ({
    type: PROCEED,
    thread,
    [PROMISE]: gdb.proceed(thread)
  })

  let interrupt = (thread) => ({
    type: INTERRUPT,
    [PROMISE]: gdb.interrupt(thread)
  })

  let stepIn = (thread) => ({
    type: STEP_IN,
    [PROMISE]: gdb.stepIn(thread)
  })

  let stepOut = (thread) => ({
    type: STEP_OUT,
    [PROMISE]: gdb.stepOut(thread)
  })

  let next = (thread) => ({
    type: NEXT,
    [PROMISE]: gdb.next(thread)
  })

  let openFile = (file) => ({
    type: OPEN_FILE,
    file
  })

  let closeFile = (file) => ({
    type: CLOSE_FILE,
    file
  })

  let selectThread = (thread) => ({
    type: SELECT_THREAD,
    thread
  })

  let focus = (file, line) => ({
    type: FOCUS,
    file,
    line
  })

  let addThread = (data) => ({
    type: ADD_THREAD,
    id: data.id,
    gid: data['group-id']
  })

  let removeThread = (data) => ({
    type: REMOVE_THREAD,
    id: data.id
  })

  let attachTarget = (pid) => ({
    type: ATTACH_TARGET,
    [ASYNC]: async () => {
      await gdb.attach(pid)
      dispatch(getSources())
    }
  })

  return bindActionCreators({
    init, exit, update, fetch,
    addBreak, removeBreak, run, proceed,
    interrupt, stepIn, stepOut, next,
    openFile, closeFile, selectThread, focus,
    addThread, removeThread, attachTarget
  }, dispatch)
}

