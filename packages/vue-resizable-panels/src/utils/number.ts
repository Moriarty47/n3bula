import { PERCISION } from '@/components/constant';

export const fuzzyCompareNumbers = (
  actual: number,
  expected: number,
  fractionDigits: number = PERCISION
): number => {
  if (
    actual.toFixed(fractionDigits) === expected.toFixed(fractionDigits)
  ) return 0;
  return actual > expected ? 1 : -1;
};

export const fuzzyNumbersEqual = (
  actual: number,
  expected: number,
  fractionDigits: number = PERCISION
): boolean => {
  return fuzzyCompareNumbers(actual, expected, fractionDigits) === 0;
};

export const fuzzyLayoutEqual = (
  actual: number[],
  expected: number[],
  fractionDigits: number = PERCISION
): boolean => {
  if (actual.length !== expected.length) return false;

  for (let i = 0; i < actual.length; i += 1) {
    const actualSize = actual[i] as number;
    const expectedSize = expected[i] as number;
    if (!fuzzyNumbersEqual(actualSize, expectedSize, fractionDigits)) return false;
  }

  return true;
};