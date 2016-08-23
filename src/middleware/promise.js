import { FAILURE, REQUEST } from '../constants.js'

export const PROMISE = Symbol('promise')

/**
 * This middleware handles async actions that has Promises.
 * It maps the action with a promise to two actions:
 * the first is REQUEST action (which is just a wrapper around
 * original action) and the second one is either a FAILURE
 * action with related error or original action with the results.
 * Note: by default the object with which promise resolves will
 * be written to the `result` property of the action object.
 * If you want it to be inlined, pass `inline: true`.
 */
export let promiseMiddleware = store => next => action => {
  let promise = action[PROMISE]
  if (!promise) return next(action)

  let { type, inline } = action

  return next({
    type: REQUEST,
    action: type,
    promise: promise.then(
      (result) => inline ? next({ ...action, ...result }) : next({ ...action, result }),
      (error) => next({ error, action: type, type: FAILURE })
    )
  })
}
