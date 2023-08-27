import {
  isNumber,
  isString,
  isNullable,
  getCharLength,
} from '@n3bula/utils';

export const EMPTY_CHAR = ' ';
export const HASH_CHAR = '#';
export const NULL_CHAR = 'NULL';

export type BiTreeNode = {
  val?: number | string;
  left: BiTreeNode;
  right: BiTreeNode;
} & {
  value?: number | string;
  left: BiTreeNode;
  right: BiTreeNode;
};

export function getTreeDepth(tree: BiTreeNode): number {
  if (!tree) return 0;
  return Math.max(
    getTreeDepth(tree.left),
    getTreeDepth(tree.right)
  ) + 1;
}

export function levelOrderTraversal(tree: BiTreeNode): [string[][], number, number, number] {
  const nodesArr: string[][] = [];
  const queue: (BiTreeNode | null)[] = [tree];
  const treeDepth = getTreeDepth(tree);
  const nodesNum = 2 ** (treeDepth) - 1;
  let maxNumber = Number.MIN_SAFE_INTEGER;
  while (!queue.every(i => i === null)) {
    const levelSize = queue.length;
    const levelNodes: string[] = [];
    for (let i = 0; i < levelSize; i += 1) {
      const node = queue.shift();
      let value = node ? (node.value ?? node.val) : null;
      if (isNumber(value) && value > maxNumber) {
        maxNumber = value;
      } else if (isString(value)) {
        if (isNaN(value as unknown as number)) {
          const charLength = getCharLength(value);
          if (charLength > maxNumber) {
            maxNumber = charLength;
          }
        } else {
          value = Number(value);
          value > maxNumber && (maxNumber = value);
        }
      } else if (isNullable(value)) {
        value = NULL_CHAR;
      }
      levelNodes.push(`${value}`);
      queue.push(node?.left || null);
      queue.push(node?.right || null);
    }
    nodesArr.push(levelNodes);
  }
  return [
    nodesArr,
    treeDepth,
    nodesNum,
    maxNumber,
  ];
}
