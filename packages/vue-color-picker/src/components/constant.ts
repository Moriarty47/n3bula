import type { InjectionKey } from 'vue';
import type { HSV } from '@/utils/color-utils';

export const changeHSVInjectionKey = Symbol('changeHSV') as InjectionKey<(value?: HSV) => void>;