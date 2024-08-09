import { test, expect } from 'vitest';
import { rgb, hex, rgb2cmyk, rgb2hex, rgb2grayscale, rgb2hsl, rgb2hsv, rgb2hwb, rgb2xyz, rgb2lab } from '@/transform/rgb';
import { rgbData, hexData, rgb2cmykData, rgb2hexData, rgb2grayscaleData, rgb2hslData, rgb2hsvData, rgb2hwbData, rgb2xyzData, rgb2labData } from '$test/test-data';

test.each(rgbData)(
  '[rgb] $v -> $e',
  ({ v, e }) => {
    expect(rgb(v)).toMatchObject(e);
  }
);

test.each(hexData)(
  '[rgb hex] $v -> $e',
  ({ v, e }) => {
    expect(rgb(v)).toMatchObject(e);
  }
);

test.each(rgb2hexData)(
  '[rgb to hex] $v -> $e',
  ({ v, e }) => {
    expect(rgb2hex(v)).toMatchObject(e);
  }
);

test.each(hexData)(
  '[hex] $v -> $e',
  ({ v, e }) => {
    expect(hex(v as `#${string}`)).toMatchObject(e);
  }
);

test.each(rgb2cmykData)(
  '[rgb to cmyk] $v -> $e',
  ({ v, e }) => {
    expect(rgb2cmyk(v)).toMatchObject(e);
  }
);

test.each(rgb2grayscaleData)(
  '[rgb to grayscale] $v -> $e',
  ({ v, e }) => {
    expect(rgb2grayscale(v)).toMatchObject(e);
  }
);

test.each(rgb2hslData)(
  '[rgb to hsl] $v -> $e',
  ({ v, e }) => {
    expect(rgb2hsl(v)).toMatchObject(e);
  }
);

test.each(rgb2hsvData)(
  '[rgb to hsv] $v -> $e',
  ({ v, e }) => {
    expect(rgb2hsv(v)).toMatchObject(e);
  }
);

test.each(rgb2hwbData)(
  '[rgb to hwb] $v -> $e',
  ({ v, e }) => {
    expect(rgb2hwb(v)).toMatchObject(e);
  }
);

test.each(rgb2xyzData)(
  '[rgb to xyz] $v -> $e',
  ({ v, e }) => {
    expect(rgb2xyz(v)).toMatchObject(e);
  }
);

test.each(rgb2labData)(
  '[rgb to lab] $v -> $e',
  ({ v, e }) => {
    expect(rgb2lab(v)).toMatchObject(e);
  }
);
