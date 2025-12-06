import { echo, sample, HEX_COLORS } from '../dist/index.js';

window.esmEcho = async (fn) => {
  echo('--------------------- Running in ESM ---------------------');
  await fn(echo, sample, HEX_COLORS);
  echo('--------------------- Running in ESM ---------------------');
};