import { INIT, FETCH } from '../constants.js'
import { Map, Record } from 'immutable'

const File = new Record({ name: null, src: null })

export default (state = new Map(), action) => {
  switch (action.type) {
    case INIT:
      let files = action.files.map((f) => [
        f.fullname, new File({ name: f.file })
      ])
      return state.merge(files)
    case FETCH:
      return state.setIn([action.file, 'src'], action.src)
    default:
      return state
  }
}
