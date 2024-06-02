# `@n3bula/watcher`

### A file system watcher based on chokidar with rename event.

## Install

```sh
npm install @n3bula/watcher
# or
yarn add @n3bula/watcher
# or
pnpm add @n3bula/watcher
```

## Use

```ts
import path from 'path';
import n3bulaWatcher from '@n3bula/watcher';

const cwd = process.cwd();
const testDirPath = path.join(cwd, 'test_dir');
const watcher = n3bulaWatcher(
  testDirPath,
  {
    ignoreInitial: true,
    ignored: ['**/ignoredDir/**/*'],
  },
  (event, oldPath, newPath /* or bigIntStats */) => {
    console.log('event, oldPath, newPath :>>', event, oldPath, newPath);
  },
);

watcher.on('ready', () => {
  console.log('running...');
});
```

## Author

- [Moriarty47](https://github.com/Moriarty47)

## License

[The MIT License(MIT)](https://github.com/Moriarty47/n3bula/blob/main/LICENSE)
