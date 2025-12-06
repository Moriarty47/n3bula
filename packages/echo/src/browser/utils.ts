import { isBrowser, NArray, Store as CommonStore } from '../common/utils';

import type { PropertiesHyphen } from 'csstype';
import type { TStyle } from './types';

export function getBase64Image(url: string, height: number = 100): Promise<PropertiesHyphen> {
  if (isBrowser()) {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.height = height || image.naturalHeight;
        canvas.width = (height * image.naturalWidth) / image.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL();
        resolve({
          'font-size': '1px',
          padding: `${canvas.height}px ${canvas.width}px`,
          background: `url(${dataUrl}) no-repeat`,
          'background-size': 'cover',
        });
      };
      image.onerror = reject;
      image.src = url;
    });
  }
  return Promise.resolve({});
}

export const stringifyCSS = (css: PropertiesHyphen) =>
  Object.keys(css).reduce((cssStr, key) => (cssStr += `${key}:${css[key as keyof PropertiesHyphen]};`), '');

export class Store extends CommonStore<TStyle> {
  promisify: boolean = false;
  styles: NArray<string> = new NArray();
  css: NArray<TStyle> = new NArray();
  addArgs(...args: any[]) {
    if (!this.cmds.length) return;
    const lastCmd = this.cmds.at(-1);
    if (!lastCmd) return;

    if (lastCmd === 'css') {
      this.promisify = args.some(arg => arg && !!arg.url);
    }

    this[lastCmd].push(...args);
  }
  addCSS(key: string, value: any) {
    this.css[0] ||= {};
    if (key === 'text-decoration') {
      this.css[0][key] ||= '';
      this.css[0][key] += ` ${value}`;
      return;
    }
    this.css[0][key as keyof PropertiesHyphen] = value;
  }
  addStyle(index: number, style: string) {
    this.styles[index] ||= '';
    this.styles[index] += style;
  }
  clear() {
    super.clear();
    this.styles.length = 0;
  }
  print() {
    return [this.cmds.copy, this.css.copy, this.fg.copy, this.bg.copy, this.styles.copy];
  }
}
