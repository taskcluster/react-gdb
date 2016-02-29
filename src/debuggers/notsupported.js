
/**
 * Error to be thrown if an AbstractDebugger implementation doesn't support
 * the method being called.
 *
 * The UI can then choose to test error thrown is `instanceof NotSupportedError`
 * and gracefully handle cases where a debugger doesn't support all features.
 */
export default class NotSupportedError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name);
  }
}
