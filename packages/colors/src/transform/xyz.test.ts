import { test, expect } from 'vitest';
import { xyz, xyz2lab, xyz2rgb } from '@/transform/xyz';
import { xyz2labData, xyz2rgbData, xyzData } from '$test/test-data';

test.each(xyzData)(
  '[xyz] $v -> $e',
  ({ v, e }) => {
    expect(xyz(v)).toMatchObject(e);
  }
);

test.each(xyz2rgbData)(
  '[xyz to rgb] $v -> $e',
  ({ v, e }) => {
    expect(xyz2rgb(v)).toMatchObject(e);
  }
);

test.each(xyz2labData)(
  '[xyz to lab] $v -> $e',
  ({ v, e }) => {
    expect(xyz2lab(v)).toMatchObject(e);
  }
);
