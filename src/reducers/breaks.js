import { ADD_BREAK, REMOVE_BREAK } from '../constants.js'
import { Map, Record } from 'immutable'

export default (state = new Map(), action) => {
  switch (action.type) {
    case ADD_BREAK:
      return state.set(action.result.id, action.result)
    case REMOVE_BREAK:
      return state.delete(action.breakpoint.id)
    default:
      return state
  }
}
