import { parse } from '@/parser';
import { describe, expect, test } from 'vitest';

describe('Parse [update] command', () => {

  test('basic command', () => {
    const result = parse(`update users set username = momo where userId = 5`);

    expect(result.params.set[0].key).toBe('username');
    expect(result.params.set[0].value).toBe('momo');
    expect(result.params.where[0].key).toBe('userId');
    expect(result.params.where[0].value).toBe('5');
    expect(result.params.table).toBe('users');
    expect(result.type).toBe('update');
  });

  test('command with multiple sets', () => {
    const result = parse(`update users set username = momo, age = 23 where userId = 5`);

    expect(result.params.set[0].key).toBe('username');
    expect(result.params.set[0].value).toBe('momo');
    expect(result.params.set[1].key).toBe('age');
    expect(result.params.set[1].value).toBe('23');
    expect(result.params.where[0].key).toBe('userId');
    expect(result.params.where[0].value).toBe('5');
    expect(result.params.table).toBe('users');
    expect(result.type).toBe('update');
  });
});