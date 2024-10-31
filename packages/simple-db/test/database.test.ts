import fs from 'fs';
import { describe, expect, test, afterEach, beforeEach } from 'vitest';
import { Database } from '@/database';
import { MAGIC_HEADER, PAGE_SIZE } from '@/constants';
import { DataType, deserialize, serialize } from '@/utils';

test('serialize', () => {
  let buf = serialize(1);
  expect(buf.length).toBe(9);
  expect(buf[0]).toBe(DataType.Number);
  expect(buf.readDoubleBE(1)).toBe(1);

  buf = serialize('a');
  expect(buf.length).toBe(1 + Buffer.from('a').length);
  expect(buf[0]).toBe(DataType.String);
  expect(buf.subarray(1).toString()).toBe('a');

  buf = serialize(true);
  expect(buf.length).toBe(2);
  expect(buf[0]).toBe(DataType.Boolean);
  expect(buf[1]).toBe(1);

  buf = serialize(false);
  expect(buf.length).toBe(2);
  expect(buf[0]).toBe(DataType.Boolean);
  expect(buf[1]).toBe(0);
});

test('deserialize', () => {
  let buf = serialize(1);
  expect(deserialize(buf)).toBe(1);

  buf = serialize('a');
  expect(deserialize(buf)).toBe('a');

  buf = serialize(true);
  expect(deserialize(buf)).toBe(true);

  buf = serialize(false);
  expect(deserialize(buf)).toBe(false);
});

test('Corrupted DataBase', () => {
  const bad = new Database({
    name: 'bad',
    root: './test/fixture',
  });
  expect(() => bad.open()).toThrowError('\x1b[43;30m[SimpleDB]\x1b[m Cannot open the db file. File maybe corrupted.');
});

describe('Database', () => {
  let db: Database;

  beforeEach(() => {
    console.log('create');
    db = new Database({
      name: 'good',
      root: './test/fixture',
    });
  });

  afterEach(() => {
    db.close();
    // @ts-ignore
    if (fs.existsSync(db.dbPath)) {
      console.log('remove');
      // @ts-ignore
      fs.unlinkSync(db.dbPath);
    }
  });

  test('get', () => {
    expect(() => db.get('key')).toThrowError('\x1b[43;30m[SimpleDB]\x1b[m Database is not open yet. Try call `db.open` first.');
    db.open();
    expect(db.get('key')).toBe(null);
    db.set('key', 'value');
    expect(db.get('key')).toBe('value');
  });

  test('set', () => {
    expect(() => db.set('key', 'value')).toThrowError('\x1b[43;30m[SimpleDB]\x1b[m Database is not open yet. Try call `db.open` first.');
    db.open();
    expect(db.get('key')).toBe(null);
    db.set('key', 'value');
    expect(db.get('key')).toBe('value');
  });

  test('check file header', () => {
    db.open();
    let buf = Buffer.alloc(100);
    // @ts-ignore
    const fd = fs.openSync(db.dbPath, 'r+');
    fs.readSync(fd, buf, 0, 100, 0);
    expect(buf.subarray(0, 20).toString()).toBe(MAGIC_HEADER.toString());
    expect(buf.readInt16BE(20)).toBe(PAGE_SIZE);
    expect(buf.readInt32BE(22)).toBe(0);
    expect(buf.readInt32BE(26)).toBe(0);

    db.set('key', 'value');

    buf = Buffer.alloc(100);
    fs.readSync(fd, buf, 0, 100, 0);
    expect(buf.subarray(0, 20).toString()).toBe(MAGIC_HEADER.toString());
    expect(buf.readInt16BE(20)).toBe(PAGE_SIZE);
    expect(buf.readInt32BE(22)).toBe(1);
    expect(buf.readInt32BE(26)).toBe(1);
  });
});