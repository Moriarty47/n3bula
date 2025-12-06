import { ENABLE_TRACE, HEX_COLOR_KEYS, STLYE_KEYS } from '../common/constants';

import type { PropertiesHyphen } from 'csstype';
import type { CallRun, Color, EchoMethod, Command as CommonCommand } from '../common/types';

export type Command = 'css' | CommonCommand;

export type ColorOption<OmitKey extends keyof IColorOptions> = {
  [K in HEX_COLOR_KEYS]: Pick<IColorOptions, OmitKey> & CallRun;
};
export interface IColorOption<OmitKey extends keyof IColorOptions, OmitKey2 extends keyof IColorOptions>
  extends ColorOption<OmitKey> {
  (...colors: Color[]): Omit<IColorOptions, OmitKey2> & CallRun;
}

export type StyleOptions = {
  [K in STLYE_KEYS]: Omit<IColorOptions, 'css'> & StyleOptions;
};

export type TStyle = (PropertiesHyphen & { url?: string }) | null;

type HasNonDataUrl<T> = T extends { url: infer U }
  ? U extends string
    ? U extends `data:${string}`
      ? false
      : true
    : false
  : false;

// 辅助类型：检查元组中是否有任意元素包含非'data:'开头的url
type HasNonDataUrlInTuple<T extends any[]> = T extends [infer First, ...infer Rest]
  ? HasNonDataUrl<First> extends true
    ? true
    : HasNonDataUrlInTuple<Rest>
  : false;

export type IColorOptions = {
  bg: IColorOption<'fg', 'bg'>;
  fg: IColorOption<'bg', 'fg'>;
  css: StyleOptions & {
    <T extends TStyle[]>(...styles: T): HasNonDataUrlInTuple<T> extends true ? CallRun<Promise<void>> : CallRun;
  };
  SPACE(count?: number): string;
};

export type EchoFunc = {
  (...args: any[]): void;
} & IColorOptions;

export type Echo = EchoFunc &
  Record<EchoMethod, EchoFunc> & {
    [ENABLE_TRACE]?: boolean;
    __TAG: string;
  };
