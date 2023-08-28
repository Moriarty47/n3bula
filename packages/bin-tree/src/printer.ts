import {
  EMPTY_CHAR as SPACE_CHAR,
  getTreeDepth,
  type BiTreeNode,
} from './utils';
import {
  padStartEnd,
  isObject,
  isSymbol,
  getCodePointLength,
} from '@n3bula/utils';

export type PrinterOptionMarks = {
  dash: string;
  lt: string;
  rt: string;
  lb: string;
  rb: string;
  joint: string;
};

export type PrinterOptions = {
  type: 'line' | 'slash';
  minLength: number;
  marks: PrinterOptionMarks;
};

const defaults: PrinterOptions = {
  type: 'line',
  minLength: 2,
  marks: {
    dash: '━',
    lt: '┏',
    rt: '┓',
    lb: '┗',
    rb: '┛',
    joint: '┻',
  }
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends {} ? DeepPartial<T[P]> : T[P];
};

const simpleMerge = <T extends Record<string, any>>(
  source: T,
  object: DeepPartial<T> = {},
): T => {
  const merged: T = { ...source };
  (Object.keys(source) as (keyof T)[]).forEach(key => {
    if (isObject(source[key])) {
      merged[key] = simpleMerge(
        source[key],
        object[key] as DeepPartial<T[keyof T]>,
      );
      return;
    }
    merged[key] = (object[key] || source[key]) as T[keyof T];
  });
  return merged;
};

const SYMBOL_EMPTY = Symbol('Empty');
const SYMBOL_SLASH = Symbol('/');
const SYMBOL_BACKSLASH = Symbol('\\');
const SYMBOL_SPACE = Symbol('Space');

type MatrixRow = (number | string | symbol)[];
type Matrix = MatrixRow[];

export default function binTreePrinter(tree: BiTreeNode, options: Partial<PrinterOptions> = {}): string | null {
  const config = simpleMerge(defaults, options);
  if (config.type === 'slash') {
    return trianglePrint(tree, config);
  }
  return linePrint(tree, config);
  // return tableLinePrint(tree, config);
}

/**
 * @description
 * To draw like this, (n is level) , we have:
 * - width = (2^(n-1)-1)*3+2^(n-1) = 2^(n+1)-3
 * - height = 2^(n-1)
 * ```txt
 *             5          
 *       ┏━━━━━┻━━━━━┓    
 *       4···········6    
 *    ┏━━┛···········┗━━┓ 
 *   211···············72 
 *     
 * ```
 */
function linePrint(tree: BiTreeNode, config: PrinterOptions): string {
  const treeDepth = getTreeDepth(tree);
  const width = (2 << (treeDepth - 1)) - 1;
  const height = 2 * treeDepth - 1;
  const matrix: Matrix = Array.from({ length: height }, () => Array(width).fill(SYMBOL_SPACE));
  const maxLength = Math.max(findMaxLength(tree), config.minLength);

  const props = {
    treeDepth,
    matrix,
    config,
    width,
    height,
    maxLength
  };
  fillLineMatrix(tree, props, 0, (width - 1) / 2);

  return drawLineTree(matrix, width, height, maxLength);
}

function drawLineTree(
  matrix: Matrix,
  width: number,
  height: number,
  maxLength: number
): string {
  let str = '';

  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      const char = matrix[i][j];
      if (char === SYMBOL_SPACE) {
        str += padStartEnd(SPACE_CHAR, maxLength, SPACE_CHAR);
      } else {
        str += padStartEnd(`${char as string}`, maxLength, SPACE_CHAR);
      }
    }
    str += '\n';
  }

  return str;
}

function fillLineMatrix(
  tree: BiTreeNode,
  props: {
    matrix: Matrix,
    config: PrinterOptions,
    width: number,
    height: number,
    treeDepth: number,
    maxLength: number,
  },
  x: number, // node position
  y: number,
) {
  let cx = 0;
  let cLy: number = 0; // col
  let cRy: number = 0; // col
  if (tree) {
    cx = x + 1; // current node branch line
    props.matrix[x][y] = tree.val as MatrixRow[0];
    if (tree.left && tree.right) {
      props.matrix[cx][y] = padStartEnd(props.config.marks.joint, props.maxLength, props.config.marks.dash);
    } else if (tree.left && !tree.right) {
      props.matrix[cx][y] = padStartEnd(props.config.marks.rb, props.maxLength, props.config.marks.dash, SPACE_CHAR);
    } else if (!tree.left && tree.right) {
      props.matrix[cx][y] = padStartEnd(props.config.marks.lb, props.maxLength, SPACE_CHAR, props.config.marks.dash);
    }
    const halfLineRange = Math.floor(2 ** (props.treeDepth - 2 - (x / 2)));

    if (tree.left) {
      for (cLy = y - 1; cLy > y - halfLineRange; cLy -= 1) {
        props.matrix[cx][cLy] = props.config.marks.dash.repeat(props.maxLength);
      }
      props.matrix[cx][cLy] = padStartEnd(props.config.marks.lt, props.maxLength, SPACE_CHAR, props.config.marks.dash);
    }
    if (tree.right) {
      for (cRy = y + 1; cRy < y + halfLineRange; cRy += 1) {
        props.matrix[cx][cRy] = props.config.marks.dash.repeat(props.maxLength);
      }
      props.matrix[cx][cRy] = padStartEnd(props.config.marks.rt, props.maxLength, props.config.marks.dash, SPACE_CHAR);
    }
    cx += 1; // next node line
    fillLineMatrix(tree.left, props, cx, cLy);
    fillLineMatrix(tree.right, props, cx, cRy);
  }
}

function findMaxLength(tree: BiTreeNode): number {
  const stack: BiTreeNode[] = [tree];
  let maxLength = 0;
  while (!stack.every(i => !i)) {
    const node = stack.shift();
    if (node) {
      const valLen = getCodePointLength(`${node.val! as string}`);
      if (maxLength < valLen) {
        maxLength = valLen;
      }
      stack.push(node.left, node.right);
    }
  }
  return maxLength % 2 === 1 ? maxLength : maxLength + 1;
}

/* ************************************************************************* */

/**
 * 
 * @description
 * To draw like this, (n is level) , we have:
 * - width = (2^(n-1)-1)*3+2^(n-1) = 2^(n+1)-3
 * - height = 2^(n-1)
 * ```txt
 *         1
 *        /·\
 *       /···\
 *      /·····\
 *     2·······3
 *    /·\·····/·\
 *   4···5···6···7
 * ```
 * |char||function|
 * |:-|:-|:-|
 * |SYMBOL_SLASH||print '/'|
 * |SYMBOL_BACKSLASH||print '\'|
 * |SYMBOL_SPACE||print SPACE_CHAR|
 * |char||print char|
 */
function trianglePrint(tree: BiTreeNode, config: PrinterOptions): string | null {
  const { maxLength } = preorderTraversal(tree);
  const treeDepth = getTreeDepth(tree);
  const width = (2 << treeDepth) - 3;
  const height = (2 << (treeDepth - 1)) - 1;

  const matrix: Matrix = Array.from({ length: height }, () => Array(width).fill(SYMBOL_SPACE));
  fillMatrix(tree, matrix, width, height, 0, (width - 1) / 2);
  console.log('maxLength', maxLength);
  console.log(matrix);
  return drawTriangleTree(matrix, width, height, maxLength);
}

function drawTriangleTree(matrix: Matrix, width: number, height: number, maxLength: number): string {
  let str = '';
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      const char = matrix[i][j];
      let temp;
      if (char === SYMBOL_SLASH) {
        temp = padStartEnd('/', maxLength, SPACE_CHAR);
      } else if (char === SYMBOL_BACKSLASH) {
        temp = padStartEnd('\\', maxLength, SPACE_CHAR);
      } else if (char === SYMBOL_SPACE) {
        temp = padStartEnd(SPACE_CHAR, maxLength, SPACE_CHAR);
      } else if (!isSymbol(char)) {
        let ch = `${char}`;
        temp = padStartEnd(ch, maxLength, SPACE_CHAR);
      }
      str += temp;
    }
    str += '\n';
  }
  return str;
}

function caclHeightRange(
  x: number,
  y: number,
  height: number,
  direction: 'l' | 'r'
): number {
  return y + (direction === 'l' ? -1 : 1) * Math.floor((height - x + 1) / 2);
}

/**
 * @description
 * If tree node has children, the index should be y±(height-x+1)/2
 */
function fillMatrix(
  tree: BiTreeNode,
  matrix: Matrix,
  width: number,
  height: number,
  x: number,
  y: number
) {
  let cx: number = 0;
  let cy: number = 0;
  if (tree) {
    matrix[x][y] = tree.val as MatrixRow[0];
    if (tree.left) {
      cx = x + 1;
      cy = y - 1;
      const rangeL = caclHeightRange(x, y, height, 'l');
      for (; cy > rangeL; cy -= 1, cx += 1) {
        matrix[cx][cy] = SYMBOL_SLASH;
      }
    }
    if (tree.right) {
      cx = x + 1;
      cy = y + 1;
      const rangeR = caclHeightRange(x, y, height, 'r');
      for (; cy < rangeR; cy += 1, cx += 1) {
        matrix[cx][cy] = SYMBOL_BACKSLASH;
      }
    }
    fillMatrix(tree.left, matrix, width, height, cx, caclHeightRange(x, y, height, 'l'));
    fillMatrix(tree.right, matrix, width, height, cx, caclHeightRange(x, y, height, 'r'));
  }
}


function preorderTraversal(tree: BiTreeNode): { maxLength: number, data: MatrixRow; } {
  const data: MatrixRow = [];
  const stack: BiTreeNode[] = [tree];
  let maxLength = 0;
  while (!stack.every(i => !i)) {
    const node = stack.shift();
    if (node) {
      const valLen = getCodePointLength(`${node.val! as string}`);
      if (maxLength < valLen) {
        maxLength = valLen;
      }
      data.push(node.val!);
      stack.push(node.left, node.right);
    } else {
      data.push(SYMBOL_EMPTY);
    }
  }
  return { maxLength/* : maxLength % 2 === 1 ? maxLength : maxLength + 1 */, data };
}
