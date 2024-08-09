import { test, expect } from 'vitest';
import { hsl, hsl2hsv, hsl2rgb, hsl2string } from '@/transform/hsl';
import { hsl2hsvData, hsl2rgbData, hsl2stringData, hslData } from '$test/test-data';

test.each(hslData)(
  '[hsl] $v -> $e',
  ({ v, e }) => {
    expect(hsl(v)).toMatchObject(e);
  }
);

test.each(hsl2hsvData)(
  '[hsl to hsv] $v -> $e',
  ({ v, e }) => {
    expect(hsl2hsv(v)).toMatchObject(e);
  }
);

test.each(hsl2rgbData)(
  '[hsl to rgb] $v -> $e',
  ({ v, e }) => {
    expect(hsl2rgb(v)).toMatchObject(e);
  }
);

test.each(hsl2stringData)(
  '[hsl to string] $v -> $e',
  ({ v, e }) => {
    expect(hsl2string(v)).toMatchObject(e);
  }
);