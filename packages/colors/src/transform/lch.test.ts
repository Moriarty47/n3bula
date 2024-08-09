import { test, expect } from 'vitest';
import { lch, lch2lab } from '@/transform/lch';
import { lch2labData, lchData } from '$test/test-data';

test.each(lchData)(
  '[lch] $v -> $e',
  ({ v, e }) => {
    expect(lch(v)).toMatchObject(e);
  }
);

test.each(lch2labData)(
  '[lch to lab] $v -> $e',
  ({ v, e }) => {
    expect(lch2lab(v)).toMatchObject(e);
  }
);
