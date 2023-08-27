import {
  EMPTY_CHAR as SPACE_CHAR,
  HASH_CHAR,
  NULL_CHAR,
  levelOrderTraversal,
  type BiTreeNode,
} from './utils';
import {
  emptyPadStart,
  isAllSameChar,
  padStartEnd,
  getCharLength,
  getCodePointLength,
  padEnd,
  isObject,
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
  minLength: number;
  marks: PrinterOptionMarks;
};

const defaults: PrinterOptions = {
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

type MergeObj = {
  [key: string]: number | string | MergeObj;
};

const simpleMerge = (
  source: MergeObj,
  object: MergeObj = {},
  newObj: MergeObj = {}
): MergeObj => {
  Object.keys(source).forEach(key => {
    if (isObject(source[key])) {
      newObj[key] = simpleMerge(
        source[key] as MergeObj,
        object[key] as MergeObj,
        {}
      );
      return;
    }
    newObj[key] = object[key] || source[key];
  });
  return newObj;
};


export default function binTreePrinter(tree: BiTreeNode, options: Partial<PrinterOptions> = {}): string | null {
  const config = simpleMerge(defaults, options);
  const [
    nodesArr,
    treeDepth,
    nodesNum,
    maxNumber,
  ] = levelOrderTraversal(tree);
  if (nodesArr.length === 1 && nodesArr[0][0] === SPACE_CHAR) return null;

  createMarksArr(nodesArr, config as PrinterOptions, treeDepth, nodesNum, maxNumber);

  return generateTreeStr(nodesArr, config as PrinterOptions);
}

function generateTreeStr(nodesArr: string[][], config: PrinterOptions): string {
  const { marks } = config;
  let treeStr = '';
  nodesArr.forEach((nodes, idx) => {
    let branchStr = '';
    if (idx === 0) {
      branchStr += nodes.join('') + '\n';
    } else {
      let temp = '';
      let useBranch = false;
      nodes.forEach(node => {
        const strLength = getCodePointLength(node);
        const isSameEmptyChar = isAllSameChar(node, SPACE_CHAR);
        const isSameHashChar = isAllSameChar(node, HASH_CHAR);
        if (!useBranch && isSameEmptyChar) {
          branchStr += emptyPadStart(strLength, '', SPACE_CHAR);
        } else if (!useBranch && isSameHashChar) {
          useBranch = true;
          branchStr += padStartEnd(marks.lb, strLength, SPACE_CHAR, marks.dash);
        } else if (!useBranch && !isSameEmptyChar) {
          useBranch = true;
          branchStr += padStartEnd(marks.lt, strLength, SPACE_CHAR, marks.dash);
        } else if (useBranch && isSameEmptyChar) {
          branchStr += padEnd(marks.dash, strLength, marks.dash);
        } else if (useBranch && isSameHashChar) {
          branchStr += strLength > 1
            ? padStartEnd(marks.joint, strLength, marks.dash)
            : marks.joint;
        } else if (useBranch && !isSameEmptyChar && !isSameHashChar) {
          useBranch = false;
          branchStr += padStartEnd(marks.rt, strLength, marks.dash, SPACE_CHAR);
        }
        // current level data
        temp += isSameHashChar ? emptyPadStart(strLength, '', SPACE_CHAR) : node;
      });
      if (branchStr.endsWith(marks.dash)) {
        //  deal with the right subtree is null
        let turnStrIndex = branchStr.lastIndexOf(marks.joint);
        const turnStr = branchStr.slice(0, turnStrIndex);
        branchStr = turnStr + marks.rb;
      }
      branchStr += '\n' + temp + '\n';
    }
    treeStr += branchStr;
  });
  return treeStr;
}

function createMarksArr(
  nodesArr: string[][],
  config: PrinterOptions,
  treeDepth: number,
  nodesNum: number,
  maxNumber: number
) {
  const maxNumLen = Math.max(config.minLength, getCharLength(String(maxNumber)));
  const maxNumberLength = maxNumLen % 2 === 0 ? maxNumLen + 1 : maxNumLen;
  const emptySpace = emptyPadStart(maxNumberLength, '', SPACE_CHAR);
  let nodesLength = nodesNum;
  const uniqueHashes: boolean[] = [];
  nodesArr.forEach((nodes, level) => {
    const lvGap = 2 ** (treeDepth - level);
    const lvNodes = Array(nodesNum).fill(emptySpace);
    let nodeIdx = nodesLength = (nodesLength - 1) / 2;
    nodes.forEach((node, idx) => {
      if (idx !== 0) {
        const midIdx = nodeIdx + lvGap / 2;
        if (node.includes(NULL_CHAR)) {
          if (idx - 1 >= 0 && nodes[idx - 1].includes(NULL_CHAR)) {
            uniqueHashes[midIdx] = true;
          }
        }
        if (!uniqueHashes[midIdx]) {
          uniqueHashes[midIdx] = true;
          lvNodes[midIdx] = emptyPadStart(maxNumberLength, HASH_CHAR, HASH_CHAR);
        }
        nodeIdx += lvGap;
      }
      lvNodes[nodeIdx] = padStartEnd(
        node.includes(NULL_CHAR) ? SPACE_CHAR : node,
        maxNumberLength,
        SPACE_CHAR
      );
    });
    nodesArr[level] = lvNodes;
  });
}