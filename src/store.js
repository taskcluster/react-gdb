import { createStore, combineReducers,
  compose, applyMiddleware } from 'redux'
import { asyncMiddleware } from './middleware/async.js'
import { promiseMiddleware } from './middleware/promise.js'
import { errorMiddleware } from './middleware/error.js'
import sources from './reducers/sources.js'
import threads from './reducers/threads.js'
import breaks from './reducers/breaks.js'
import UIState from './reducers/ui-state.js'

const DEVELOPMENT = process.env.NODE_ENV === 'development'

let reducer = combineReducers({
  sources,
  threads,
  breaks,
  UIState
})

let middlewares = [
  asyncMiddleware,
  promiseMiddleware
]

if (DEVELOPMENT) middlewares.push(errorMiddleware)

let enhancer = compose(
  applyMiddleware.apply(this, middlewares),
  DEVELOPMENT && window && window.devToolsExtension ?
    window.devToolsExtension() : (f) => f
)

export default () => createStore(reducer, enhancer)

