import { test, expect } from 'vitest';
import { cmyk, cmyk2rgb } from '@/transform/cmyk';
import { cmyk2rgbData, cmykData } from '$test/test-data';

test.each(cmykData)(
  '[cmyk] $v -> $e',
  ({ v, e }) => {
    expect(cmyk(v)).toMatchObject(e);
  }
);

test.each(cmyk2rgbData)(
  '[cmyk to rgb] $v -> $e',
  ({ v, e }) => {
    expect(cmyk2rgb(v)).toMatchObject(e);
  }
);