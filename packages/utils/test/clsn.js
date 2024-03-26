import test from 'ava';
import clsn from '../src/clsn';

console.log('    clsn > compat test');
test('Keeps object keys with truthy values', t => {
  t.is(
    clsn({ a: true, b: false, c: 0, d: null, e: undefined, f: 1 }),
    'a f',
  );
});

test('Joins array of class names and ignore falsy values', t => {
  t.is(
    clsn('a', 0, null, undefined, true, 1, 'b'),
    'a 1 b',
  );
});

test('Supports heterogenous arguments', t => {
  t.is(
    clsn({ a: true, b: '1' }, 'c', ''),
    'a b c'
  );
});

test('Returns an empty string for an empty configuration', t => {
  t.is(
    clsn({}),
    ''
  );
});

test('Supports an array of class names', t => {
  t.is(
    clsn(['a', 'b']),
    'a b',
  );
});

test('Joins array arguments with string arguments', t => {
  t.plan(2);
  t.is(
    clsn(['a', 'b'], 'c'),
    'a b c'
  );
  t.is(
    clsn('a', ['b', 'c']),
    'a b c'
  );
});

test('Handles multiple array arugments', t => {
  t.is(
    clsn(['a', 'b'], ['c', 'd']),
    'a b c d'
  );
});

test('Handles arrays that include falsy and truthy values', t => {
  t.is(
    clsn(['a', 0, null, 'b', false, true, undefined, '']),
    'a b',
  );
});

test('Hanldes arrays that include arrays', t => {
  t.is(
    clsn(['a', ['b', 'c']]),
    'a b c',
  );
});

test('Handles arrays that include objects', t => {
  t.is(
    clsn(['a', { b: true, c: false, d: '' }]),
    'a b',
  );
});

test('Handles deep array recursion', t => {
  t.is(
    clsn(['a', ['b', ['c', { d: true }]]]),
    'a b c d'
  );
});

test('Handles arrays that are empty', t => {
  t.is(
    clsn('a', []),
    'a'
  );
});

test('Handles nested arrays that have empty nested arrays', t => {
  t.is(
    clsn('a', [[[]]], 'b'),
    'a b'
  );
});

test('Handles all types of truthy and falsy property values', t => {
  t.is(
    clsn({
      null: null,
      emptyString: '',
      noNumber: NaN,
      zero: 0,
      negativeZero: -0,
      false: false,
      undefined: undefined,

      nonEmptyString: 'abc',
      whitespace: ' ',
      function: () => { },
      emptyObject: {},
      nonEmptyObject: { a: 1, b: 2 },
      emptyArray: [],
      nonEmptyArray: [1, 2, 3],
      greaterZero: 1,
      lessZero: -1
    }),
    'nonEmptyString whitespace function emptyObject nonEmptyObject emptyArray nonEmptyArray greaterZero lessZero'
  );
});