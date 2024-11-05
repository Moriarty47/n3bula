import { parse } from '@/parser';
import { describe, expect, test } from 'vitest';

describe('Parse [create] command', () => {

  test('basic command', () => {
    const result = parse(`create table users username`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns[0]).toBe('username');
    expect(result.type).toBe('create table');
  });

  test('command with string', () => {
    const result = parse(`create table users "username"`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns[0]).toBe('username');
    expect(result.type).toBe('create table');
  });

  test('command with space separeted array', () => {
    const result = parse(`create table users username password`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns[0]).toBe('username');
    expect(result.params.columns[1]).toBe('password');
    expect(result.type).toBe('create table');
  });

  test('command with regular array', () => {
    const result = parse(`create table users ["username", "password"]`);

    expect(result.params.table).toBe('users');
    expect(result.params.columns[0]).toBe('username');
    expect(result.params.columns[1]).toBe('password');
    expect(result.type).toBe('create table');
  });
});