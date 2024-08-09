import { test, expect } from 'vitest';
import { lab, lab2lch, lab2xyz } from '@/transform/lab';
import { lab2lchData, lab2xyzData, labData } from '$test/test-data';

test.each(labData)(
  '[lab] $v -> $e',
  ({ v, e }) => {
    expect(lab(v)).toMatchObject(e);
  }
);

test.each(lab2xyzData)(
  '[lab to xyz] $v -> $e',
  ({ v, e }) => {
    expect(lab2xyz(v)).toMatchObject(e);
  }
);

test.each(lab2lchData)(
  '[lab to lch] $v -> $e',
  ({ v, e }) => {
    expect(lab2lch(v)).toMatchObject(e);
  }
);
