import { HexColors } from '../common/constants';
import { sample } from '../common/utils';
import { echo } from './index';

import type { IColorOption } from './types';

echo.__enable_trace = true;

console.clear();
// echo('Hello World!');
console.log(echo.fg.cadetBlue.toString('Hello World!'));
console.log(
  echo
    .fg('#1ff', 'black')
    .bg('#000', 'white')
    .toString('Hello', {}, ['xxx'], 'World!'),
);
console.log(echo.fg.cadetBlue.valueOf('Hello World!'));
console.log(
  echo
    .fg('#1ff', 'black')
    .bg('#000', 'white')
    .valueOf('Hello', {}, ['xxx'], 'World!'),
);
echo.fg('purple', 'rgb(255,0,0)')('Hello World!', 'Oops');
echo.fg.magenta('Hello', {}, 'World!');
echo.bg.darkOrange('Hello', [], 'World!');
echo.fg('', 'hsl(350, 40, 50)').bg('', 'rgb(120, 120, 120)')(
  'Hello',
  {},
  'World!',
);

const colors = sample(Object.keys(HexColors), 10);
for (let i = 0, len = colors.length; i < len; i += 2) {
  const j = colors[i] as keyof IColorOption<'bg', 'fg'>;
  const k = colors[i + 1] as keyof IColorOption<'bg', 'fg'>;
  echo.fg(j, '').bg('', k)('Hello', 'World!');
}

echo.css.italic.reverse.fg.lightGreen('italic reverse');
console.log(echo.css.underline.fg.lightGreen.valueOf('underline'));
echo.css.underline.italic.fg.lightGreen('underline italic');
echo
  .css(['underline', 'italic'], ['bold', 'linethrough'])
  .fg.lightGreen('underline italic', 'bold linethrough');
echo.css.italic.reverse('abc');

echo.log('Hello World!');
echo.log.fg.magenta.bg.green('Hello World!');
echo.info.bg.cyan.fg.white('Hello World!');
echo.warn.bg.yellow.fg.black('Hello World!');
// echo.warn.info('Hello World!');
echo.error.bg.red('Hello World!');
