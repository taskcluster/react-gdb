import { PROMISE } from './promise.js'

export const ASYNC = Symbol('async')

/**
 * This middleware is a wrapper around `promiseMiddleware`.
 * It maps the action with an async function to action with a promise.
 */
export let asyncMiddleware = store => next => action => {
  let fn = action[ASYNC]
  if (!fn) return next(action)

  return next({ ...action, [PROMISE]: fn() })
}

