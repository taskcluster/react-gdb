import { UPDATE, PROCEED, REMOVE_THREAD, ADD_THREAD } from '../constants.js'
import { Map, List, Record } from 'immutable'
import { Frame } from './common.js'

const Thread = new Record({
  gid: null,
  status: 'running',
  context: new List(),
  callstack: new List(),
  frame: new Frame()
})

export default (state = new Map(), action) => {
  switch (action.type) {
    case UPDATE:
      let { thread, context, callstack, filename } = action
      // TODO: below should be done by gdb-js
      let line = parseInt(action.line, 10)
      let newThread = state.get(thread).withMutations(map => {
        map.set('context', new List(context))
          .set('callstack', new List(callstack))
          .set('frame', new Frame({ file: filename, line }))
          .set('status', 'stopped')
      })
      return state.set(thread, newThread)
    case PROCEED:
      return state.setIn([action.thread, 'status'], 'running')
    case ADD_THREAD:
      let id = parseInt(action.id, 10)
      return state.set(id, new Thread({ gid: action.gid }))
    case REMOVE_THREAD:
      return state.delete(action.id)
    default:
      return state
  }
}
