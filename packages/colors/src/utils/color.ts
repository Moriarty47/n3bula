import { clamp } from '@/utils';
import { colorType } from '@/utils/constants';
import type { ColorType } from '@/utils/types';

const colorWithoutHex = [...colorType];
colorWithoutHex.pop();
const colorTypeRegex = `^(${colorWithoutHex.join('|')})`;

export function checkColorType(value: string): ColorType | undefined {
  if (/^(#[0-9A-F]{8}|#[0-9A-F]{6}|#[0-9A-F]{4}|#[0-9A-F]{3})$/i.test(value)) return 'hex';

  const match = value.match(new RegExp(colorTypeRegex));

  if (!match) return;

  return match[1] as ColorType;
};

export function extractValues(color: string): string[] {
  const colors = color.match(/-?\d+(\.\d+)?%?/g);
  if (!colors) return [];
  return colors;
}

export function isHex(color: string): color is `#${string}` {
  return /^#([0-9A-F]{8}|[0-9A-F]{6}|[0-9A-F]{4}|[0-9A-F]{3})$/i.test(color);
}

export const normalizeHue = (h: number) => h % 360 + (h >= 0 ? 0 : 360);

export const normalizeAlpha = (a?: number) => a !== undefined ? clamp(a, 0, 1) : a;

export const normalize100 = (channel: number) => clamp(channel, 0, 100);

export const normalize255 = (channel: number) => clamp(channel, 0, 255);

export const normalize360 = (channel: number) => clamp(channel, 0, 360);
