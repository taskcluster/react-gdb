import { INIT, FETCH_FILE, GET_SOURCES } from '../constants.js'
import { Map } from 'immutable'

export default (state = new Map(), action) => {
  switch (action.type) {
    case GET_SOURCES:
      let files = action.result.map((f) => [f, ''])
      // We're merging state into new map (not the other way)
      // because we don't want to lose already fetched sources.
      return new Map(files).merge(state)
    case FETCH_FILE:
      return state.set(action.file, action.result)
    default:
      return state
  }
}
