/** @type {import('ava').TestFn} */
const test = require('ava');
const { default: EventEmitter } = require('../lib');

/** @type {EventEmitter} */
let emitter;

Array
  .from({ length: 10 }, (_, i) => (i * Math.floor(Math.random() * 3) + 1))
  .forEach((argsCount, idx) => {
    emitter = new EventEmitter();
    test(`${idx + 1}: use ${argsCount} arguments`, async t => {
      const res = new Promise((resolve) => {
        emitter.on('data', (...rest) => {
          resolve(rest.length);
        });
        emitter.emit('data', ...Array(argsCount).fill(true));
      });
      t.is(await res, argsCount);
    });
  });