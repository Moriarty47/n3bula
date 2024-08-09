import { test, expect } from 'vitest';
import { hwb, hwb2rgb } from '@/transform/hwb';
import { hwb2rgbData, hwbData } from '$test/test-data';

test.each(hwbData)(
  '[hwb] $v -> $e',
  ({ v, e }) => {
    expect(hwb(v)).toMatchObject(e);
  }
);

test.each(hwb2rgbData)(
  '[hwb to rgb] $v -> $e',
  ({ v, e }) => {
    expect(hwb2rgb(v)).toMatchObject(e);
  }
);
