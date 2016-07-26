import { ADD_BREAK, REMOVE_BREAK } from '../constants.js'
import { Map, Record } from 'immutable'

const Break = new Record({ file: null, thread: null, line: null })

export default (state = new Map(), action) => {
  switch (action.type) {
    case ADD_BREAK:
      let result = action.result
      // TODO: below should be done by gdb-js
      let line = parseInt(result.line, 10)
      // XXX: `number` in GDB/MI could be either a
      // `<id>` or a `<id>.<location>` string. We're
      // interested only in the id.
      let id = parseInt(result.number, 10)
      let thread = parseInt(result.thread, 10) || 'all'
      return state.set(id, new Break({ file: result.fullname, thread, line }))
    case REMOVE_BREAK:
      return state.delete(action.id)
    default:
      return state
  }
}
