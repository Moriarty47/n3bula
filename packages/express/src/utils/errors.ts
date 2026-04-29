import { ERROR_TYPE } from './constants';

export class RequiredError extends Error {
  constructor(message?: string);
  constructor(message?: string, options?: ErrorOptions);
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = ERROR_TYPE.RequiredError;
  }
}

export class ValidateError extends Error {
  constructor(message?: string);
  constructor(message?: string, options?: ErrorOptions);
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = ERROR_TYPE.ValidateError;
  }
}

export const isError = (arg: unknown): arg is Error => {
  try {
    if (arg == null || typeof arg !== 'object') return false;

    return arg instanceof Error;
  } catch {
    return false;
  }
};

export const isRequiredError = (error: unknown): error is RequiredError => {
  if (error instanceof RequiredError) return true;
  if ((error as any)?.name === ERROR_TYPE.RequiredError) return true;
  return false;
};

export const isValidateError = (error: unknown): error is ValidateError => {
  if (error instanceof ValidateError) return true;
  if ((error as any)?.name === ERROR_TYPE.ValidateError) return true;
  return false;
};
