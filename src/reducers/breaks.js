import { BREAK_ADD, BREAK_REMOVE } from '../constants'
import { Map, Record } from 'immutable'

const Break = new Record({ file: null, thread: null, line: null })

export default (state = new Map(), action) => {
  switch (action.type) {
    case BREAK_ADD:
      let { thread, line, fullname } = action
      return state.set(action.number,
        new Break({ file: fullname, thread, line }))
    case BREAK_REMOVE:
      return state.delete(action.id)
    default:
      return state
  }
}
