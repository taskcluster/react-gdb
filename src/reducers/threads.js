import { UPDATE_THREAD,
  REMOVE_THREAD, ADD_THREAD } from '../constants.js'
import { OrderedMap, List, Record } from 'immutable'

const Thread = new Record({
  thread: null, // gdb-js Thread object
  group: null, // gdb-js ThreadGroup object
  context: new List(), // list of gdb-js Variable objects
  callstack: new List() // list of gdb-js Frame objects
})

export default (state = new OrderedMap(), action) => {
  switch (action.type) {
    case UPDATE_THREAD:
      let thread = state.get(action.thread.id)
      let { callstack, context } = action
      // XXX: investigate this workaround
      if (thread) {
        return state.set(action.thread.id, new Thread({
          thread: action.thread,
          group: thread.get('group'),
          context: context ? new List(context) : thread.get('context'),
          callstack: callstack ? new List(callstack) : thread.get('callstack')
        }))
      } else {
        return state
      }
    case ADD_THREAD:
      return state.set(action.thread.id,
        new Thread({ thread: action.thread, group: action.thread.group }))
    case REMOVE_THREAD:
      return state.delete(action.thread.id)
    default:
      return state
  }
}
