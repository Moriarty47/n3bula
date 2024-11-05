import { parse } from '@/parser';
import { describe, expect, test } from 'vitest';

describe('Parse [create index] command', () => {

  test('basic command', () => {
    const result = parse(`create index mainIndex on users userId`);

    expect(result.params.name).toBe('mainIndex');
    expect(result.params.table).toBe('users');
    expect(result.params.columns[0]).toBe('userId');
    expect(result.type).toBe('create index');
  });
});