import { UPDATE, REMOVE_THREAD, ADD_THREAD } from '../constants.js'
import { Map, List, Record } from 'immutable'

const Frame = new Record({ file: null, line: null })

const Thread = new Record({
  gid: null,
  vars: new List(),
  callstack: new List(),
  frame: new Frame()
})

export default (state = new Map(), action) => {
  switch (action.type) {
    case UPDATE:
      let { thread, vars, callstack, filename } = action
      // TODO: below should be done by gdb-js
      let line = parseInt(action.line, 10)
      let newThread = state.get(thread).withMutations(map => {
        map.set('vars', new List(vars))
          .set('callstack', new List(callstack))
          .set('frame', new Frame({ file: filename, line }))
      })
      return state.set(thread, newThread)
    case ADD_THREAD:
      return state.set(action.id, new Thread({ gid: action.gid }))
    case REMOVE_THREAD:
      return state.delete(action.id)
    default:
      return state
  }
}
