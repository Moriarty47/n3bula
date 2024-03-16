/** @type {import('ava').TestFn} */
const test = require('ava');
const { default: EventEmitter } = require('../lib');

/** @type {EventEmitter} */
let emitter;

Array
  .from({ length: 10 }, (_, i) => (i * Math.floor(Math.random() * 5) + 2))
  .forEach((resCount, idx) => {
    test(`${idx + 1}: emit count ${resCount}`, t => {
      emitter = new EventEmitter();
      let count = 0;
      emitter.once('data', () => count++);
      for (let i = 0; i < resCount; i += 1) {
        emitter.emit('data');
      }
      t.timeout(1000);
      t.is(count, 1);
    });
  });
