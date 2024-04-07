import fs from 'fs';
import path from 'path';
import test from 'ava';
import { extract, serialize } from '../src/frontmatter';

console.log('    frontmatter > compat test');
test('extract is a function', t => {
  t.is(typeof extract, 'function');
});

const processCwd = process.cwd();

test('parse yaml by "---"', t => {
  const str = fs.readFileSync(path.join(processCwd, 'example/dashes-yaml.md'), 'utf8');
  const yaml = extract(str);
  t.truthy(yaml.frontmatter, 'should have "frontmatter" key');
  t.is(yaml.frontmatter.title, 'dashes yaml test');
  t.is(yaml.frontmatter.tags.length, 2);
  t.is(yaml.frontmatter['extra-description'].length, 3);

  t.truthy(yaml.body, 'should have "body" key');
  t.truthy(yaml.body.match("Break test, won't break here."), 'should match body');
  t.truthy(yaml.body.match('---'), 'should match body');
  t.truthy(yaml.body.match('This is other text.'), 'should match body');

  t.truthy(yaml.bodyBegin, 'should have "bodyBegin" key');
  t.is(yaml.bodyBegin, 12);
});

test('parse yaml by "= yaml ="', t => {
  const str = fs.readFileSync(path.join(processCwd, 'example/equal-yaml.md'), 'utf8');
  const yaml = extract(str);
  t.truthy(yaml.frontmatter, 'should have "frontmatter" key');
  t.is(yaml.frontmatter.title, 'equal yaml test');
  t.is(yaml.frontmatter.description, 'Just an example of using `= yaml =`');

  t.truthy(yaml.body, 'should have "body" key');
  t.truthy(yaml.body.match("Break test, won't break here."), 'should match body');
  t.truthy(yaml.body.match('= yaml ='), 'should match body');
  t.truthy(yaml.body.match('This is other text.'), 'should match body');

  t.truthy(yaml.bodyBegin, 'should have "bodyBegin" key');
  t.is(yaml.bodyBegin, 6);
});

test('parse yaml ended by "..."', t => {
  const str = fs.readFileSync(path.join(processCwd, 'example/dots-ending.md'), 'utf8');
  const yaml = extract(str);
  t.truthy(yaml.frontmatter, 'should have "frontmatter" key');
  t.is(yaml.frontmatter.title, 'Example with dots document ending');
  t.is(yaml.frontmatter.description, 'Just an example of using `...`');

  t.truthy(yaml.body, 'should have "body" key');
  t.truthy(yaml.body.match("It shouldn't break with ..."), 'should match body');

  t.truthy(yaml.bodyBegin, 'should have "bodyBegin" key');
  t.is(yaml.bodyBegin, 6);
});

test('parse only frontmatter content', t => {
  const yaml = extract(`---
title: Only frontmatter here
tags: 
  - yaml
  - frontmatter
---`);

  t.truthy(yaml.frontmatter, 'should have "frontmatter" key');
  t.is(yaml.frontmatter.title, 'Only frontmatter here');
  t.is(yaml.frontmatter.tags.length, 2);

  t.is(yaml.body, '', 'should have "body" key');

  t.truthy(yaml.bodyBegin, 'should have "bodyBegin" key');
  t.is(yaml.bodyBegin, 6);
});

test('parse no frontmatter content', t => {
  const yaml = extract('No frontmatter here.');
  t.truthy(yaml.frontmatter, 'should have "frontmatter" key');
  t.deepEqual(yaml.frontmatter, {});

  t.truthy(yaml.body, 'should have "body" key');
  t.truthy(yaml.body.match('No frontmatter here.'), 'should match body');

  t.truthy(yaml.bodyBegin, 'should have "bodyBegin" key');
  t.is(yaml.bodyBegin, 1);
});

test('parse unsafe content', t => {
  t.throws(() => {
    extract(`---
toString: !<tag:yaml.org,2002:js/function> "function (){very_evil_thing();}"
---
This is content
`);
  }, {
    any: true,
    message: msg => msg.includes('unknown tag')
  }, 'should throw an error of YAMLException');
});

test('parse wrapped content in yaml', t => {
  const str = fs.readFileSync(path.join(processCwd, 'example/wrapped-content.md'), 'utf8');
  const yaml = extract(str);
  t.truthy(yaml.frontmatter, 'should have "frontmatter" key');
  t.is(yaml.frontmatter.title, 'Complex yaml example');
  t.is(yaml.frontmatter.description, 'You can use the front-matter module to convert this');
  t.is(yaml.frontmatter.tags.length, 3);

  t.is(yaml.frontmatter['folded-text'], [
    'There once was a man from Darjeeling',
    'Who got on a bus bound for Ealing',
    '    It said on the door',
    '    "Please don\'t spit on the floor"',
    'So he carefully spat on the ceiling\n'
  ].join('\n'));

  t.truthy(yaml.body, 'should have "body" key');
  t.truthy(yaml.body.match('This is content.'), 'should match body');

  t.truthy(yaml.bodyBegin, 'should have "bodyBegin" key');
  t.is(yaml.bodyBegin, 21);
});

test('parse content with byte order mark', t => {
  const yaml = extract(`﻿---
title: There's a byte order mark in the begining.
---`);
  t.is(yaml.frontmatter.title, "There's a byte order mark in the begining.");
});

test('serialize object to yaml string', t => {
  const str = serialize({
    title: 'MD frontmatter title test',
    tags: ['MD', 'frontmatter', 'HTML',],
    keywords: ['MD', 'frontmatter'],
  });
  t.is(str, `title: MD frontmatter title test
tags:
  - MD
  - frontmatter
  - HTML
keywords:
  - MD
  - frontmatter
`);
});