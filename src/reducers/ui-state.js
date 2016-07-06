import { OPEN_FILE, CLOSE_FILE, SELECT_THREAD } from '../constants'
import { OrderedSet, Map } from 'immutable'

let initialState = new Map({ openedFiles: new OrderedSet() })

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_FILE:
      return map.update('openedFiles', (files) => files.add(action.file))
    case CLOSE_FILE:
      return map.deleteIn(['openedFiles'], action.file)
    case SELECT_THREAD:
      return map.set('selectedThread', action.thread)
    default:
      return state
  }
}
