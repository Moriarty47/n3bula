import { test, expect } from 'vitest';
import { hsl, hsl2hsv, hsl2rgb } from '@/transform/hsl';
import { hsl2hsvData, hsl2rgbData, hslData } from '$test/test-data';

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
