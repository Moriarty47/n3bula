import { test, expect } from 'vitest';
import { hsv, hsv2hsl, hsv2rgb } from '@/transform/hsv';
import { hsvData, hsv2hslData, hsv2rgbData } from '$test/test-data';

test.each(hsvData)(
  '[hsv] $v -> $e',
  ({ v, e }) => {
    expect(hsv(v)).toMatchObject(e);
  }
);

test.each(hsv2hslData)(
  '[hsv to hsl] $v -> $e',
  ({ v, e }) => {
    expect(hsv2hsl(v)).toMatchObject(e);
  }
);

test.each(hsv2rgbData)(
  '[hsv to rgb] $v -> $e',
  ({ v, e }) => {
    expect(hsv2rgb(v)).toMatchObject(e);
  }
);
