import { parse } from '@/parser';
import { describe, expect, test } from 'vitest';

describe('Parse [drop] command', () => {

  test('basic command', () => {
    const result = parse(`drop users`);

    expect(result.params).toBe('users');
    expect(result.type).toBe('drop');
  });
});