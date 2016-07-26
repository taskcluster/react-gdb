import { createStore, combineReducers,
  compose, applyMiddleware } from 'redux'
import { asyncMiddleware } from './middleware/async.js'
import { promiseMiddleware } from './middleware/promise.js'
import sources from './reducers/sources.js'
import threads from './reducers/threads.js'
import breaks from './reducers/breaks.js'
import UIState from './reducers/ui-state.js'

let reducer = combineReducers({
  sources,
  threads,
  breaks,
  UIState
})

let middlewares = applyMiddleware(
  asyncMiddleware,
  promiseMiddleware
)

let enhancer = compose(
  middlewares,
  window && typeof window.devToolsExtension !== 'undefined' ?
    window.devToolsExtension() : (f) => f
)

export default () => createStore(reducer, enhancer)

