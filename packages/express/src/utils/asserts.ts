import { RequiredError } from './errors';

export function assertsDefined<T>(
  value: T | undefined | null,
  message?: any,
): asserts value is T {
  if (!value) throw new Error(message || 'Value is not defined.');
}

export function assertsRequired<T>(
  value: T | undefined | null,
  key: string,
  customMessage?: any,
): asserts value is T {
  if (value === null || value === undefined)
    throw new RequiredError(customMessage || `${key} is required`);
}

export function assertsError<T>(
  value: T | null,
  payload?: any,
): asserts value is null {
  if (value) throw payload;
}
