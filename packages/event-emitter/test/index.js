/** @type {import('ava').TestFn} */
const test = require('ava');
const { default: EventEmitter, useEventEmitter } = require('../lib');

/** @type {EventEmitter} */
let emitter;

test('use function useEventEmitter', t => {
  emitter = useEventEmitter('foo');
  t.deepEqual(
    [emitter instanceof EventEmitter, emitter['__ee_id'] === 'foo'],
    [true, true]
  );
});

test('use class EventEmitter', t => {
  emitter = new EventEmitter('bar');
  t.deepEqual(
    [emitter instanceof EventEmitter, emitter['__ee_id'] === 'bar'],
    [true, true]
  );
});

test('use function hasListeners (true)', t => {
  emitter = new EventEmitter();
  emitter.on('data', () => { });
  emitter.on('data', () => { });
  emitter.on('data', () => { });
  t.true(emitter.hasListeners());
});

test('use function hasListeners (false)', t => {
  emitter = new EventEmitter();
  t.false(emitter.hasListeners());
});

test('off all listeners', t => {
  emitter = new EventEmitter();
  emitter.on('data', () => { });
  emitter.on('data', () => { });
  emitter.on('data', () => { });
  emitter.offAll();
  t.false(emitter.hasListeners());
});

test('emit before off', t => {
  emitter = new EventEmitter();
  let count = 0;
  const cb = () => count++;
  emitter.on('data', cb);
  emitter.emit('data', 'emitBeforeOff');
  emitter.off('data', cb);
  t.timeout(1000);
  t.is(count, 1);
});


test('emit before and after off', t => {
  emitter = new EventEmitter();
  let count = 0;
  const cb = () => count++;
  emitter.on('data', cb);
  emitter.emit('data', 'emitBeforeOff');
  emitter.off('data', cb);
  emitter.emit('data', 'emitAfterOff');
  t.timeout(1000);
  t.is(count, 1);
});

test('emit after off', t => {
  emitter = new EventEmitter();
  let count = 0;
  const cb = () => count++;
  emitter.on('data', cb);
  emitter.off('data', cb);
  emitter.emit('data', 'emitAfterOff');
  t.timeout(1000);
  t.is(count, 0);
});

test('emit after once', t => {
  t.plan(2);
  emitter = new EventEmitter();
  let count = 0;
  const cb = () => { };
  const cb1 = () => count++;
  emitter.on('data', cb);
  emitter.once('data', cb1);
  emitter.off('data', cb1);
  emitter.emit('data');
  t.is(count, 0);
  emitter.off('data', cb);
  t.is(count, 0);
});


const emitter1 = new EventEmitter();
const emitter2 = new EventEmitter();
let count1 = 0;
let count2 = 0;
let count3 = 0;
let count4 = 0;
emitter1.on('data', () => ++count1);
emitter2.on('data', () => ++count2);
emitter1.once('data', () => ++count3);
emitter2.once('data', () => ++count4);

test('group emit 1', t => {
  emitter1.emit('data');
  t.deepEqual([count1, count2, count3, count4], [1, 0, 1, 0]);
});

test('group emit 2', t => {
  emitter2.emit('data');
  t.deepEqual([count1, count2, count3, count4], [1, 1, 1, 1]);
});

test('group emit 3', t => {
  emitter1.emit('data');
  t.deepEqual([count1, count2, count3, count4], [2, 1, 1, 1]);
});

test('group emit 4', t => {
  emitter2.emit('data');
  t.deepEqual([count1, count2, count3, count4], [2, 2, 1, 1]);
});