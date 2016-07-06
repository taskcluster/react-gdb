import { ASYNC } from './middleware/async'
import { PROMISE } from './middleware/promise'
import { INIT, UPDATE, FETCH, RUN, CONTINUE,
  STEP_IN, STEP_OUT, NEXT, OPEN_FILE,
  CLOSE_FILE, SELECT_THREAD, ADD_THREAD,
  REMOVE_THREAD } from './constants'

export default (gdb, getSource) => ({
  init: () => ({
    type: INIT,
    [ASYNC]: async () {
      await gdb.enableAsync()
      let files = await gdb.sourceFiles()
      return { files }
    }
  }),

  update: (data) => ({
    type: UPDATE,
    [ASYNC]: async () {
      let thread = data['thread-id']
      let callstack = await gdb.callstack(thread)
      let vars = await gdb.vars(thread)
      let file = data.frame.fullname
      let line = data.frame.line
      return { thread, callstack, vars, file, line }
    }
  }),

  fetch: (file) => ({
    type: FETCH,
    [ASYNC]: async () {
      let src = await getSource(file)
      return { file, src }
    }
  }),

  addBreak: (file, pos, thread) => ({
    type: BREAK_ADD,
    [PROMISE]: gdb.break(file, pos, thread)
  }),

  removeBreak: (id) => ({
    type: BREAK_REMOVE,
    [ASYNC]: async () => {
      await gdb.removeBreak(id)
      return { id }
    }
  })

  run: () => ({
    type: RUN,
    inline: false,
    [PROMISE]: gdb.run()
  }),

  continue: (thread) => ({
    type: CONTINUE,
    inline: false,
    [PROMISE]: gdb.continue(thread)
  }),

  stepIn: (thread) => ({
    type: STEP_IN,
    inline: false,
    [PROMISE]: gdb.stepIn(thread)
  }),

  stepOut: (thread) => ({
    type: STEP_OUT,
    inline: false,
    [PROMISE]: gdb.stepOut(thread)
  }),

  next: (thread) => ({
    type: NEXT,
    inline: false,
    [PROMISE]: gdb.next(thread)
  }),

  openFile: (file) => ({
    type: OPEN_FILE,
    file
  }),

  closeFile: (file) => ({
    type: CLOSE_FILE,
    file
  }),

  selectThread: (thread) => ({
    type: SELECT_THREAD,
    thread
  })

  addThread: (data) => ({
    type: ADD_THREAD,
    id: data.id,
    gid: data['group-id']
  }),

  removeThread: (data) => ({
    type: REMOVE_THREAD,
    id: data.id
  })
})
