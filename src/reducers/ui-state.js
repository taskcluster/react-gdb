import { OPEN_FILE, CLOSE_FILE, SELECT_THREAD,
  FOCUS, UPDATE } from '../constants.js'
import { OrderedSet, Map } from 'immutable'
import { Frame } from './common.js'

let initialState = new Map({
  openedFiles: new OrderedSet(),
  selectedThread: null,
  focusedFrame: null,
  focusOnFrame: null
})

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_FILE:
      return state.update('openedFiles', (files) => files.add(action.file))
    case CLOSE_FILE:
      return state.update('openedFiles', (files) => files.remove(action.file))
    case SELECT_THREAD:
      return state.set('selectedThread', action.thread)
    case FOCUS:
      return state.set('focusedFrame', new Frame({
        file: action.file,
        line: action.line
      }))
    case UPDATE:
      if (state.get('selectedThread') === action.thread) {
        return state.set('focusedFrame', new Frame({
          file: action.filename,
          line: action.line
        }))
      } else {
        return state
      }
    default:
      return state
  }
}
