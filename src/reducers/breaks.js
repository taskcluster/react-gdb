import { ADD_BREAK, REMOVE_BREAK } from '../constants.js'
import { Map, Record } from 'immutable'

const Break = new Record({ file: null, thread: null, line: null })

export default (state = new Map(), action) => {
  switch (action.type) {
    case ADD_BREAK:
      let { fullname } = action
      // TODO: below should be done by gdb-js
      let line = parseInt(action.line, 10)
      let thread = action.thread || 'all'
      return state.set(action.number,
        new Break({ file: fullname, thread, line }))
    case REMOVE_BREAK:
      return state.delete(action.id)
    default:
      return state
  }
}
