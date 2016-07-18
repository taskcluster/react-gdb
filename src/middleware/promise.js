import { FAILURE, REQUEST } from '../constants.js'

export const PROMISE = Symbol('promise')

/**
 * This middleware handles async actions that has Promises.
 * It maps the action with a promise to two actions:
 * the first is REQUEST action (which is just a wrapper around
 * original action) and the second one is either a FAILURE
 * action with related error or original action with the results.
 * Note: by default the object with which promise resolves will
 * be inlined into action object for convenience. If you want to
 * access the results of promise execution through `result`
 * property of the action object, pass `inline: false`.
 */
export let promiseMiddleware = store => next => action => {
  let type = action.type
  let inline = action.inline !== false
  let promise = action[PROMISE]
  if (!promise) return next(action)

  return next({
    type: REQUEST,
    action: type,
    promise: promise.then(
      (result) => inline ? next({ ...result, type }) : next({ result, type }),
      (error) => next({ error, action: type, type: FAILURE })
    )
  })
}

