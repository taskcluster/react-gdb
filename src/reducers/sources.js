import { INIT, FETCH, GET_SOURCES } from '../constants.js'
import { Map, Record } from 'immutable'

const File = new Record({ name: null, src: null })

export default (state = new Map(), action) => {
  switch (action.type) {
    case GET_SOURCES:
      let files = action.result.map((f) => [
        f.fullname, new File({ name: f.file })
      ])
      // We're merging state into new map (not the other way)
      // because we don't want to lose already fetched sources
      return new Map(files).merge(state)
    case FETCH:
      return state.setIn([action.file, 'src'], action.result)
    default:
      return state
  }
}
