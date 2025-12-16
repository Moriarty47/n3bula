export const moduleBabelConfig = {
  presets: [['@babel/preset-env', { modules: false }]],
  plugins: [
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    '@babel/plugin-transform-runtime',
    ['@vue/babel-plugin-jsx', { optimize: true }],
  ],
  minified: true,
};

export const allModulesBabelConfig = {
  presets: [['@babel/preset-env', { modules: false }]],
  minified: true,
};

export const replaceAll = (target: string, find: string, replace: string) => {
  return target.split(find).join(replace);
};

export const toHumpName = (name: string) => {
  return name.replace(/-(.)/g, g => g[1].toUpperCase());
};

export const toComponentName = (name: string) => {
  const first = name.slice(0, 1).toUpperCase();
  const last = toHumpName(name.slice(1));
  return `${first}${last}`;
};

export const makeBasicDefinition = () => {
  return `import type { FunctionalComponent, SVGAttributes } from 'vue';
interface Props extends SVGAttributes {
  color?: string;
  size?: number | string;
}
type Icon = FunctionalComponent<Props>;\n`;
};

export const parseStyles = (inlineStyle = '') =>
  inlineStyle.split(';').reduce((styleObject, stylePropertyValue) => {
    let [property, value] = stylePropertyValue
      .split(/^([^:]+):/)
      .filter((_, i) => i > 0)
      .map(i => i.trim().toLowerCase());

    styleObject[property] = value;
    return styleObject;
  }, {});

export const parseSvg = (svg: string, styles: any) => {
  // const getSpecifiedColorVar = (val: string | undefined, ident: string) => {
  //   if (!val) return '""';
  //   return val.includes(ident) ? '{color}' : '"var(--icon-background)"';
  // };

  svg = svg.replace(/<svg([^>]+)>/, `<svg$1 {...props} height={size} width={size} style={{...style,color}}>`);

  // const fillColor = getSpecifiedColorVar(styles['--geist-fill'], 'current');
  // const strokeColor = getSpecifiedColorVar(styles['--geist-stroke'], 'current');

  // svg = replaceAll(svg, '"var(--geist-foreground)"', '{color}');
  // svg = replaceAll(svg, '"var(--geist-background)"', '"var(--icon-background)"');

  // // Reset dynamic colors
  // // In a few icons, the semantics of 'fill' and 'stroke' are not correct,
  // // they maybe forced to override by style.
  // svg = replaceAll(svg, '"var(--geist-fill)"', fillColor);
  // svg = replaceAll(svg, '"var(--geist-stroke)"', strokeColor);
  return svg;
};

const warpCss = (key: string, color: string) => (color.startsWith('#') ? `${key}:${color};` : `${key}:hsl(${color});`);

export const makeThemeCss = (colorMap: Record<string, string[]>) => {
  let lightCss = `.light{`;
  let darkCss = `.dark{`;
  Object.entries(colorMap).forEach(([key, colors]) => {
    let [light, dark] = colors;
    if (!dark) dark = light;
    lightCss += warpCss(key, light);
    darkCss += warpCss(key, dark);
  });
  return `${lightCss}}\n${darkCss}}`;
};
