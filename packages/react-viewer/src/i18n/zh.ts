const i18n = {
  close: '关闭',
  prev: '前一张',
  next: '后一张',
  zoomIn: '放大',
  zoomOut: '缩小',
  rotateLeft: '左旋转',
  rotateRight: '右旋转',
  scaleX: '水平翻转',
  scaleY: '上下翻转',
  reset: '复位',
  loadFailed: '加载失败'
};

export type I18nKeys = keyof typeof i18n;

export default i18n;