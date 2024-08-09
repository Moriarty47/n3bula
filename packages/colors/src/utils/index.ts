export const NOOP = () => { };

export const epsilonN = (N: number) => (num: number) => Math.round(num * N + Number.EPSILON) / N;

export const epsilon2 = epsilonN(1e2);

export const epsilon3 = epsilonN(1e3);

export const epsilon4 = epsilonN(1e4);

export const clamp = (val: number, min: number, max: number): number => Math.min(Math.max(val, min), max);

export const mapRange = (inMin: number, inMax: number, outMin: number, outMax: number, source: number) => (source - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;

export const compose = <T>(fn: (v: T) => T, ...fns: ((v: T) => T)[]) =>
  (x: T) =>
    fn(fns.reduceRight((res, f) => f(res), x));

export const pipe = <T>(fn: (...v: T[]) => T, ...fns: ((...v: T[]) => T)[]) =>
  (...x: T[]) =>
    fns.reduce((res, f) => f(res), fn(...x));

export const toFixed = (num: number, digits: number = 0) => {
  const fixed = num.toFixed(digits);
  if (digits === 0) return Number(fixed);

  const dot = fixed.indexOf(".");
  if (dot >= 0) {
    const zerosMatch = fixed.match(/0+$/);
    if (zerosMatch) {
      if (zerosMatch.index === dot + 1) {
        return Number(fixed.substring(0, dot));
      }
      return Number(fixed.substring(0, zerosMatch.index));
    }
  }
  return Number(fixed);
};