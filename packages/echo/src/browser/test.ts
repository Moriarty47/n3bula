import { echo } from './index';
import { HEX_COLORS } from '../common/constants';
import { sample } from '../common/utils';

import type { IColorOption } from './types';

echo.css(
  {
    background: 'linear-gradient(45deg, blue, red)',
    padding: '20px',
    color: 'orange',
    'font-weight': 'bolder',
    'font-size': '20px',
    border: '3px solid #ddd',
    'border-radius': '8px',
  },
  null,
  {
    background: 'linear-gradient(45deg, red, blue)',
    padding: '20px',
    color: 'orange',
    'font-weight': 'bolder',
    'font-size': '20px',
    border: '3px solid #ddd',
    'border-radius': '8px',
  },
)(echo.__TAG, echo.SPACE(30), echo.__TAG.split('').reverse().join(''));

const colors = sample(Object.keys(HEX_COLORS), 10);
for (let i = 0, len = colors.length; i < len; i += 2) {
  const j = colors[i] as keyof IColorOption<'bg', 'fg'>;
  const k = colors[i + 1] as keyof IColorOption<'bg', 'fg'>;
  echo.fg(j, '').bg('', k)('Hello', 'World!');
}

echo('Hello World!');
echo.fg.cadetBlue('Hello World!');
echo.fg('#1ff', 'black').bg('red', 'white')('Hello', {}, ['xxx'], 'World!');
echo.fg('purple', 'rgb(255,0,0)')('Hello World!');
echo.fg.magenta('Hello', {}, 'World!');
echo.bg.darkOrange('Hello', [], 'World!');
echo.fg('', 'hsl(350, 40, 50)').bg('', 'rgb(120, 120, 120)')('Hello', {}, 'World!');

echo.css.underline.dotted.fg.lightGreen('Dotted');
echo.css(null, {
  'text-decoration': 'underline wavy',
})('This is a', 'Wavy', 'text decoration.');

await echo.trace.css(
  {
    color: 'red',
    'text-decoration': 'underline wavy',
  },
  {
    url: './1.jpg',
    // url: 'data:imag' as const,
    height: '100px',
    border: '2px solid #fcf',
    'border-radius': '8px',
  },
  {
    color: 'cyan',
  },
  {
    color: 'orange',
  },
)(echo.__TAG, ' ', 'Hello', 'World!');

echo.log('Hello World!');
echo.log.fg.magenta.bg.green('Hello World!');
echo.info('Hello World!');
echo.warn('Hello World!');
// echo.warn.info('Hello World!');
echo.error('Hello World!');
