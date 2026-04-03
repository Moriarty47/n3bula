import { echo, HEX_COLORS, sample } from '../dist/index.js';

echo.__enable_trace = true;
window.esmEcho = async fn => {
  echo('--------------------- Running in ESM ---------------------');
  await fn(echo, sample, HEX_COLORS);
  echo('--------------------- Running in ESM ---------------------');
};
