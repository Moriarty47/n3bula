export class AssertionError extends Error {
  constructor(message: string, asserter?: Function) {
    super(message);
    this.name = 'AssertionError';
    Error?.captureStackTrace(this, asserter || this.constructor);
  }
}

export const isAssertionError = (error: Error): error is AssertionError => error instanceof AssertionError;

export function assert(expectedCondition: unknown, message: string): asserts expectedCondition {
  if (!expectedCondition) {
    const error = new AssertionError(message, assert);
    throw error;
  }
};