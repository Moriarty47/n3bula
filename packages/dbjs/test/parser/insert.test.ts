import { parse } from '@/parser';
import { describe, expect, test } from 'vitest';

describe('Parse [insert] command', () => {

  test('basic command', () => {
    const result = parse(`insert users momo`);

    expect(result.params.table).toBe('users');
    expect(result.params.document[0]).toBe('momo');
    expect(result.type).toBe('insert');
  });

  test('command with multiple values', () => {
    const result = parse(`insert users momo admin`);

    expect(result.params.table).toBe('users');
    expect(result.params.document[0]).toBe('momo');
    expect(result.params.document[1]).toBe('admin');
    expect(result.type).toBe('insert');
  });

  test('command with object', () => {
    const result = parse(`insert users { "name": "momo", "age": 32 }`);

    expect(result.params.table).toBe('users');
    expect(result.params.document.name).toBe('momo');
    expect(result.params.document.age).toBe('32');
    expect(result.type).toBe('insert');
  });
});

describe('Parse [batch insert] command', () => {
  
  test('basic command', () => {
    const result = parse(`batch insert users [{"name":"momo", "age": "32" }, {"name":"admin", "age": "35" }]`);

    expect(result.params.table).toBe('users');
    expect(result.params.documents[0].name).toBe('momo');
    expect(result.params.documents[0].age).toBe('32');
    expect(result.params.documents[1].name).toBe('admin');
    expect(result.params.documents[1].age).toBe('35');
    expect(result.type).toBe('batch insert');
  });

  test('basic command', () => {
    const result = parse(`batch insert users [{"name":"momo", "age": "32", id: 123 }]`);

    expect(result.params.table).toBe('users');
    expect(result.params.documents[0].name).toBe('momo');
    expect(result.params.documents[0].age).toBe('32');
    expect(result.params.documents[0].id).toBe('123');
    expect(result.type).toBe('batch insert');
  });
});