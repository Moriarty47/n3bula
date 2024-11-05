import fs from 'node:fs';
import path from 'node:path';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { Database } from '@/database';

function removeFile(fileName: string) {
  const pt = path.resolve(__dirname, '../db', fileName);
  if (fs.existsSync(pt)) {
    fs.unlinkSync(pt);
  }
}

describe('Database tests', () => {
  let db: Database;

  beforeAll(() => {
    // Cleanup
    removeFile('data.db');
    removeFile('data.dbi');
    db = new Database('data');
    db.open();
  });

  afterAll(() => {
    // Cleanup
    db.close();
  });

  test.skip('create test', () => {
    db = new Database('data');
    db.open();
    expect(db.name).toBe('data');
    db.close();
    removeFile('data.db');
    removeFile('data.dbi');
    db = new Database('test');
    db.open();
    expect(db.name).toBe('test');
    db.close();
    removeFile('test.db');
    removeFile('test.dbi');
  });
  const data1 = { id: 1, name: 'Alice' };
  const data2 = 12341234123;
  const data3 = '✌😉🤞🎉';

  test('insert test', () => {
    db.set('users', data1);
    db.set('test', data2);
    db.set('emoji', data3);
    expect(db.get('users')).toEqual(data1);
    expect(db.get('test')).toEqual(data2);
    expect(db.get('emoji')).toEqual(data3);
  });

  test('delete test', () => {
    db.del('users');
    expect(db.get('users')).toEqual(null);
    db.del('test');
    expect(db.get('test')).toEqual(null);
    expect(db.get('emoji')).toEqual(data3);
  });

  const data2_1 = 123;
  test('update test', () => {
    db.set('users', data1);
    db.set('test', data2);
    db.put('users', { ...data1, age: 30 });
    db.put('test', data2_1);
    expect(db.get('users')).toEqual({ ...data1, age: 30 });
    expect(db.get('test')).toEqual(data2_1);
  });

  test('search test', () => {
    expect(db.get('users')).toEqual({ ...data1, age: 30 });
    expect(db.get('test')).toEqual(data2_1);
    expect(db.get('emoji')).toEqual(data3);
  });
});