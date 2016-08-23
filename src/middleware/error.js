import { FAILURE } from '../constants.js'

/**
 * This middleware just throws errors, so that they won't be swallowed.
 */
export let errorMiddleware = store => next => action => {
  if (action.type === FAILURE) console.error(action.error)

  return next(action)
}
