import { OPEN_FILE, CLOSE_FILE, SELECT_THREAD,
  APPLY_BREAKS_TO, SELECT_POSITION } from '../constants.js'
import { OrderedSet, Map, Record } from 'immutable'

let Position = new Record({ file: null, line: null })

let initialState = new Map({
  openedFiles: new OrderedSet(),
  selectedThread: null,
  selectedPosition: null,
  breakpointsAppliedTo: 'all'
})

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_FILE:
      return state.update('openedFiles', (files) => files.add(action.file))
    case CLOSE_FILE:
      return state.update('openedFiles', (files) => files.remove(action.file))
    case SELECT_THREAD:
      return state.set('selectedThread', action.id || null)
    case SELECT_POSITION:
      return state.set('selectedPosition', action.file
        ? new Position({ file: action.file, line: action.line || null }) : null)
    case APPLY_BREAKS_TO:
      return state.set('breakpointsAppliedTo', action.scope)
    default:
      return state
  }
}
