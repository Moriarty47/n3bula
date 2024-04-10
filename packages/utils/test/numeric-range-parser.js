import test from 'ava';
import { numericRangeParser as parser } from '../src/numeric-range-parser';

console.log('    numeric-range-parser > compat test');
test('numericRangeParser is a function', t => {
  t.is(typeof parser, 'function');
});

const tip = (str) => `numericRangeParser parse ${str}`;

test(tip('single number'), t => {
  t.deepEqual(parser('1'), [1]);
});

test(tip('multiple numbers'), t => {
  t.deepEqual(parser('1,2,3,4,5'), [1, 2, 3, 4, 5]);
});

test(tip('1-5'), t => {
  t.deepEqual(parser('1-5'), [1, 2, 3, 4, 5]);
});

test(tip('5-1'), t => {
  t.deepEqual(parser('5-1'), [5, 4, 3, 2, 1]);
});

test(tip('1-5,6-9'), t => {
  t.deepEqual(parser('1-5,6-9'), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test(tip('13..17'), t => {
  t.deepEqual(parser('13..17'), [13, 14, 15, 16, 17]);
});

test(tip('13...17'), t => {
  t.deepEqual(parser('13...17'), [13, 14, 15, 16]);
});

test(tip('13..17, 19, 3-5,6..8'), t => {
  t.deepEqual(parser('13..17,19,3-5,6..8'), [13, 14, 15, 16, 17, 19, 3, 4, 5, 6, 7, 8]);
});

test(tip('""'), t => {
  t.deepEqual(parser(''), []);
});

test(tip('-3'), t => {
  t.deepEqual(parser('-3'), [-3]);
});

test(tip('-3--8,1, 2'), t => {
  t.deepEqual(parser('-3--8,1,2'), [-3, -4, -5, -6, -7, -8, 1, 2]);
});

test(tip('-3..8'), t => {
  t.deepEqual(parser('-3..8'), [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
});

test(tip('-1..3,-4..-2'), t => {
  t.deepEqual(parser('-1..3,-4..-2'), [-1, 0, 1, 2, 3, -4, -3, -2]);
});

test(tip('3‥4'), t => {
  t.deepEqual(parser('3‥4'), [3, 4]);
});

test(tip('3⋯5'), t => {
  t.deepEqual(parser('3⋯5'), [3, 4]);
});

test(tip('4…6'), t => {
  t.deepEqual(parser('4…6'), [4, 5]);
});
