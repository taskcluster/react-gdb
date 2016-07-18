import { OPEN_FILE, CLOSE_FILE, SELECT_THREAD } from '../constants.js'
import { OrderedSet, Map } from 'immutable'

let initialState = new Map({ openedFiles: new OrderedSet() })

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_FILE:
      return state.update('openedFiles', (files) => files.add(action.file))
    case CLOSE_FILE:
      // XXX: Why deleteIn works wrong here?
      return state.update('openedFiles', (files) => files.remove(action.file))
    case SELECT_THREAD:
      return state.set('selectedThread', action.thread)
    default:
      return state
  }
}
