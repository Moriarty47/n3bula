import { describe, test, expect } from 'vitest';
import { findIndexOfTheMaxElement } from '@/utils';

describe('Utils tests', () => {

  test('findIndexOfTheMaxElement', () => {
    expect(findIndexOfTheMaxElement([1, 2, 3, 4, 5, 6, 7, 8, 9], 3, (a, b) => a - b))
      .toEqual(3); // 4

    expect(findIndexOfTheMaxElement([1, 3, 5, 7, 9], 4, (a, b) => a - b))
      .toEqual(2); // 5

    expect(findIndexOfTheMaxElement([1, 3, 5, 7, 9], 4, (a, b) => b - a))
      .toEqual(-1); // undefined
  });
});