import test from 'ava';
import { NCache } from '../src/cache';


console.log('    cache > compat test');
test('NCache is a function', t => {
  t.is(typeof NCache, 'function');
});

test('NCache puts a cache', async t => {
  const cache = new NCache();
  await cache.put('test', 'test');
  t.is(cache.size, 1);
  cache.clear();
});

test('NCache puts a number cache', async t => {
  const cache = new NCache();
  await cache.put('test', 12341241);
  t.is(cache.size, 1);
  cache.clear();
});

test('NCache puts a object cache', async t => {
  const cache = new NCache();
  await cache.put('test', { name: 'test' });
  t.is(cache.size, 1);
  cache.clear();
});

test('NCache puts a different value on the same key cache', async t => {
  const cache = new NCache();
  await cache.put('test', { name: 'test' });
  await cache.put('test', { name: 'some test' });
  t.is((await cache.get('test')).value.name, 'some test');
  t.is(cache.size, 1);
  cache.clear();
});

test('NCache puts a cache with timeout', async t => {
  const cache = new NCache();
  await cache.put('test', 'test', 10000/* 10s */);
  t.is(cache.size, 1);
  cache.clear();
});

test('NCache matches a cache', async t => {
  const cache = new NCache();
  await cache.put('test', 'test');
  const res = await cache.get('test');
  t.is(cache.size, 1);
  t.is(res.value, 'test');
  cache.clear();
});

test('NCache matches a cache with a timeout', async t => {
  const cache = new NCache();
  await cache.put('test', 'test', 10000/* 10s */);
  const currentTime = Date.now();
  const res = await cache.get('test');
  t.is(cache.size, 1);
  t.is(res.value, 'test');
  // give or take a timeout
  t.truthy(Math.abs(res.expire - (currentTime + 10000)) < 5);
  cache.clear();
});

test('NCache matches a cache with a non-numeric timeout', async t => {
  const cache = new NCache();
  await cache.put('test', 'test', 'timeout');
  const currentTime = Date.now();
  const res = await cache.get('test');
  t.is(cache.size, 1);
  t.is(res.value, 'test');
  t.truthy(res.expire >= currentTime + 10000);
  cache.clear();
});

test('NCache matches a cache with a NaN timeout', async t => {
  const cache = new NCache();
  await cache.put('test', 'test', NaN);
  const currentTime = Date.now();
  const res = await cache.get('test');
  t.is(cache.size, 1);
  t.is(res.value, 'test');
  t.truthy(res.expire >= currentTime + 10000);
  cache.clear();
});

test('NCache matches a cache with a negative timeout', async t => {
  const cache = new NCache();
  await cache.put('test', 'test', -1000);
  t.is(await cache.get('test'), undefined);
  t.is(cache.size, 0);
  cache.clear();
});

test('NCache deletes a existing cache and return true', async t => {
  const cache = new NCache();
  await cache.put('test', 'test');
  t.is(await cache.delete('test'), true);
  t.is(cache.size, 0);
  cache.clear();
});

test('NCache deletes a existing cache multiple times', async t => {
  const cache = new NCache();
  await cache.put('test', 'test');
  t.is(await cache.delete('test'), true);
  t.is(await cache.delete('test'), false);
  t.is(await cache.delete('test'), false);
  t.is(cache.size, 0);
  cache.clear();
});

test('NCache deletes a non-existing cache and return false', async t => {
  const cache = new NCache();
  t.is(await cache.delete('test'), false);
  t.is(cache.size, 0);
  cache.clear();
});

test('NCache deletes a non-existing cache multiple times', async t => {
  const cache = new NCache();
  t.is(await cache.delete('test'), false);
  t.is(await cache.delete('test'), false);
  t.is(await cache.delete('test'), false);
  t.is(cache.size, 0);
  cache.clear();
});

test('NCache deletes a cache without touching other caches', async t => {
  const cache = new NCache();
  await cache.put('test', 'test');
  await cache.put('test1', 'test1');
  await cache.put('test2', 'test2');
  t.is(await cache.delete('test'), true);
  t.is(cache.size, 2);
  t.is((await cache.get('test1')).value, 'test1');
  t.is((await cache.get('test2')).value, 'test2');
  cache.clear();
});

test('NCache clears cache', async t => {
  const cache = new NCache();
  await cache.put('test', 'test');
  await cache.put('test1', 'test1');
  await cache.put('test2', 'test2');
  t.is(cache.size, 3);
  cache.clear();
  t.is(cache.size, 0);
  cache.clear();
});

test('NCache cache hit count when debug mode off', async t => {
  const cache = new NCache({ debug: false });
  await cache.put('test', 'test');
  await cache.get('test');
  t.is(cache.hitCount, 0);
  cache.clear();
});

test('NCache cache hit count when debug mode on', async t => {
  const cache = new NCache({ debug: true });
  await cache.put('test', 'test');
  await cache.get('test');
  t.is(cache.hitCount, 1);
  cache.clear();
});

test('NCache cache miss count when debug mode off', async t => {
  const cache = new NCache({ debug: false });
  await cache.put('test', 'test');
  await cache.get('test1');
  t.is(cache.missCount, 0);
  cache.clear();
});

test('NCache cache miss count when debug mode on', async t => {
  const cache = new NCache({ debug: true });
  await cache.put('test', 'test');
  await cache.get('test1');
  t.is(cache.missCount, 1);
  cache.clear();
});

test('NCache when cache is not empty return false', async t => {
  const cache = new NCache();
  await cache.put('test', 'test');
  t.is(cache.isEmpty, false);
  cache.clear();
});

test('NCache when cache is empty return true', async t => {
  const cache = new NCache();
  t.is(cache.isEmpty, true);
  cache.clear();
});

test('NCache get all cached keys', async t => {
  const cache = new NCache();
  await cache.put('test', 'test');
  await cache.put('test1', 'test1');
  await cache.put('test2', 'test2');
  t.deepEqual(await cache.keys(), ['test', 'test1', 'test2']);
  cache.clear();
});

test('NCache status function when debug mode off', async t => {
  const cache = new NCache();
  await cache.put('test', 'test');
  await cache.put('test1', 'test1');
  await cache.put('test2', 'test2');
  await cache.get('test1');
  await cache.get('test2');
  await cache.get('test3');
  t.deepEqual(cache.status(false), {
    hitCount: 0,
    missCount: 0,
    cacheSize: 3,
  });
  t.deepEqual(cache.status(true), 'cache size: 3, hit count: 0, miss count: 0');
  cache.clear();
});

test('NCache status function when debug mode on', async t => {
  const cache = new NCache({ debug: true });
  await cache.put('test', 'test');
  await cache.put('test1', 'test1');
  await cache.put('test2', 'test2');
  await cache.get('test1');
  await cache.get('test2');
  await cache.get('test3');
  t.deepEqual(cache.status(false), {
    hitCount: 2,
    missCount: 1,
    cacheSize: 3,
  });
  t.deepEqual(cache.status(true), 'cache size: 3, hit count: 2, miss count: 1');
  cache.clear();
});
