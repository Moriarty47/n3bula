import { ENABLE_TRACE, HEX_COLOR_KEYS, ASCIISTYLE_KEYS } from '../common/constants';
import { CallRun, Color, EchoMethod } from '../common/types';

export type ColorOption<OmitKey extends keyof IColorOptions> = {
  [K in HEX_COLOR_KEYS]: Pick<IColorOptions, OmitKey> & CallRun;
};

export interface IColorOption<OmitKey extends keyof IColorOptions, OmitKey2 extends keyof IColorOptions>
  extends ColorOption<OmitKey> {
  (...colors: Color[]): Omit<IColorOptions, OmitKey2> & CallRun;
}

export type StyleOptions = {
  [K in ASCIISTYLE_KEYS]: Omit<IColorOptions, 'css'> & StyleOptions & CallRun;
};

export type IColorOptions = {
  bg: IColorOption<'fg', 'bg'>;
  fg: IColorOption<'bg', 'fg'>;
  css: StyleOptions & {
    (...cssOptions: (keyof StyleOptions)[][]): Omit<IColorOptions, 'css'> & CallRun;
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
