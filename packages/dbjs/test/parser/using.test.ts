import { parse } from '@/parser';
import { describe, expect, test } from 'vitest';

describe('Parse [using] command', () => {

  test('basic command', () => {
    const result = parse(`using n3bulaDB`);

    expect(result.params).toBe('n3bulaDB');
    expect(result.type).toBe('using');
  });
});