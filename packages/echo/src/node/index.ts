export { HexColors } from '../common/constants';
export { sample } from '../common/utils';

import { createEchoProxy, defineProperties } from '../common/core';

import type { Echo, IColorOptions } from './types';

export const echo = createEchoProxy(true) as unknown as Echo;

export const chalk = createEchoProxy(false) as unknown as IColorOptions;

defineProperties(echo);
