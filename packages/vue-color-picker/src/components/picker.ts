import { rgb2hsl } from '@n3bula/colors';
import type { HSL } from '@/utils/color-utils';

export class ColorPicker {
  canvas: HTMLCanvasElement;
  shadow: HTMLCanvasElement;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  shadowCtx: CanvasRenderingContext2D;
  constructor(dom: HTMLCanvasElement, shadowDom: HTMLCanvasElement) {
    this.canvas = dom;
    this.shadow = shadowDom;
    if (!this.canvas) {
      throw new Error('Canvas element not found');
    }
    const { width, height } = this.canvas;
    this.width = width;
    this.height = height;
    this.canvas.style.width = shadowDom.style.width = width + 'px';
    this.canvas.style.height = shadowDom.style.height = height + 'px';

    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    this.shadowCtx = shadowDom.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
  }

  getSize(): { width: number; height: number; } {
    return { width: this.width, height: this.height };
  }

  draw(hue: number) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'source-over';
    this.shadowCtx.globalCompositeOperation = 'source-over';

    let gradient = this.ctx.createLinearGradient(0, this.height, 0, 0);
    gradient.addColorStop(0, '#000');
    gradient.addColorStop(1, '#FFF');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    gradient = this.shadowCtx.createLinearGradient(this.width, 0, 0, 0);
    gradient.addColorStop(0, `hsl(${hue},100%,50%)`);
    gradient.addColorStop(1, `#FFF`);
    this.shadowCtx.fillStyle = gradient;
    this.shadowCtx.fillRect(0, 0, this.width, this.height);

    const ctxImageDataSettings = this.ctx.getImageData(0, 0, this.width, this.height);
    const ctxImageData = ctxImageDataSettings.data;
    const shadowCtxImageData = this.shadowCtx.getImageData(0, 0, this.width, this.height).data;

    for (let i = 0, len = ctxImageData.length; i < len; i += 4) {
      ctxImageData[i] = shadowCtxImageData[i] * ctxImageData[i] / 255;
      ctxImageData[i + 1] = shadowCtxImageData[i + 1] * ctxImageData[i + 1] / 255;
      ctxImageData[i + 2] = shadowCtxImageData[i + 2] * ctxImageData[i + 2] / 255;
    }
    this.ctx.putImageData(ctxImageDataSettings, 0, 0);
  }
}