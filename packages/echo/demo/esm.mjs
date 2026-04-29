import { chalk, echo, HexColors, sample } from '../dist/browser/index.js';

echo.__enable_trace = true;
window.esmEcho = async fn => {
  echo.css({
    background: 'linear-gradient(45deg, red, green)',
    border: '3px solid #ddd',
    'border-radius': '8px',
    color: 'orange',
    'font-size': '20px',
    'font-weight': 'bolder',
    padding: '20px',
  })('--------------------- Running in ESM ---------------------');
  await fn(echo, sample, HexColors, chalk);
  echo.css({
    background: 'linear-gradient(45deg, red, green)',
    border: '3px solid #ddd',
    'border-radius': '8px',
    color: 'orange',
    'font-size': '20px',
    'font-weight': 'bolder',
    padding: '20px',
  })('--------------------- Running in ESM ---------------------');
};
