import { parse } from '@/parser';
import { describe, expect, test } from 'vitest';

describe('Parse [select] command', () => {

  test('basic command', () => {
    const result = parse(`select * from users`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns).toBe('asterisk');
    expect(result.type).toBe('select');
  });

  test('command with a column', () => {
    const result = parse(`select username from users`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns[0]).toBe('username');
    expect(result.type).toBe('select');
  });

  test('command with a quotation word as column', () => {
    const result = parse(`select "username" from users`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns[0]).toBe('username');
    expect(result.type).toBe('select');
  });

  test('command with an array word as columns', () => {
    const result = parse(`select ["userId", "username"] from users`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns[0]).toBe('userId');
    expect(result.params.columns[1]).toBe('username');
    expect(result.type).toBe('select');
  });

  test('command with where clause', () => {
    const result = parse(`select * from users where userId = 5`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns).toBe('asterisk');
    expect(result.type).toBe('select');
    expect(result.params.where[0].key).toBe('userId');
    expect(result.params.where[0].value).toBe('5');
    expect(result.params.where[0].operator).toBe('equal');
  });

  test('with two where clauses', () => {
    const result = parse(`select * from users where userId = 5 and username like momo`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns).toBe('asterisk');
    expect(result.type).toBe('select');
    expect(result.params.where[0].key).toBe('userId');
    expect(result.params.where[0].value).toBe('5');
    expect(result.params.where[0].operator).toBe('equal');
    expect(result.params.where[1].key).toBe('username');
    expect(result.params.where[1].value).toBe('momo');
    expect(result.params.where[1].operator).toBe('like');
  });

  test('command with three where clauses', () => {
    const result = parse(`select * from users where userId = 5 and username like momo and age < 32`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns).toBe('asterisk');
    expect(result.type).toBe('select');
    expect(result.params.where[0].key).toBe('userId');
    expect(result.params.where[0].value).toBe('5');
    expect(result.params.where[0].operator).toBe('equal');
    expect(result.params.where[1].key).toBe('username');
    expect(result.params.where[1].value).toBe('momo');
    expect(result.params.where[1].operator).toBe('like');
    expect(result.params.where[2].key).toBe('age');
    expect(result.params.where[2].value).toBe('32');
    expect(result.params.where[2].operator).toBe('smaller');
  });
});