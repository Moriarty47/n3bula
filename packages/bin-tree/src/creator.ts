import binTreePrinter from './printer';
import { type BiTreeNode } from './utils';

export type BinTreeNodeType = BinTreeNode | null;
export type BinTreeNodeValue = string | number | null;
export type BinTreeData = BinTreeNodeValue[];

export class BinTreeNode {
  value: BinTreeNodeValue;
  left: BinTreeNodeType;
  right: BinTreeNodeType;

  constructor(
    value: BinTreeNodeValue,
    left: BinTreeNodeType = null,
    right: BinTreeNodeType = null,
  ) {
    this.value = value;
    this.left = left;
    this.right = right;
  }

  get val(): BinTreeNodeValue {
    return this.value;
  }

  set val(val) {
    this.value = val;
  }

  print(options?: Parameters<typeof binTreePrinter>[1]) {
    return binTreePrinter(this as BiTreeNode, options);
  }

  getSize(): number {
    const _getSize = (tree: BinTreeNodeType): number => {
      if (!tree) return 0;
      return 1 + _getSize(tree.left) + _getSize(tree.right);
    };
    return _getSize(this);
  }

  getLeafNodeSize(): number {
    const _getSize = (tree: BinTreeNodeType): number => {
      if (!tree) return 0;
      if (!tree.left && !tree.right) return 1;
      return _getSize(tree.left) + _getSize(tree.right);
    };
    return _getSize(this);
  }

  getLevelNodeSize(n: number): number {
    const _getSize = (tree: BinTreeNodeType, m: number): number => {
      if (!tree || m <= 0) return 0;
      if (m === 1) return 1;
      return _getSize(tree.left, m - 1) + _getSize(tree.right, m - 1);
    };
    return _getSize(this, n);
  }

  getHeight(): number {
    return this.getDepth();
  }

  getDepth(): number {
    const _getDepth = (tree: BinTreeNodeType): number => {
      if (!tree) return 0;
      const leftTD = _getDepth(tree.left);
      const rightTD = _getDepth(tree.right);
      return 1 + Math.max(leftTD, rightTD);
    };
    return _getDepth(this);
  }

  isValidBST(): boolean {
    const isValid = (tree: BinTreeNodeType, left = -Infinity, right = Infinity): boolean => {
      if (!tree) return true;
      const val = tree.value as number;
      return (left < val && val < right)
        && isValid(tree.left, left, val)
        && isValid(tree.right, val, right);
    };
    return isValid(this);
  }

  find(data: BinTreeNodeValue) {
    const _find = (tree: BinTreeNodeType, val: BinTreeNodeValue): BinTreeNodeType => {
      if (!tree || data === null) return null;
      if (tree.value === val) return tree;
      const res = _find(tree.left, val);
      if (res) return res;
      return _find(tree.right, val);
    };
    return _find(this, data);
  }

  preorderTraversal(): BinTreeNodeValue[] {
    const traversal = (node: BinTreeNodeType, treeData: BinTreeNodeValue[] = []): BinTreeNodeValue[] => {
      if (!node) return treeData;
      treeData.push(node.value);
      traversal(node.left, treeData);
      traversal(node.right, treeData);
      return treeData;
    };

    return traversal(this);
  }

  inorderTraversal(): BinTreeNodeValue[] {
    const traversal = (node: BinTreeNodeType, treeData: BinTreeNodeValue[] = []): BinTreeNodeValue[] => {
      if (!node) return treeData;
      traversal(node.left, treeData);
      treeData.push(node.value);
      traversal(node.right, treeData);
      return treeData;
    };

    return traversal(this);
  }

  postorderTraversal(): BinTreeNodeValue[] {
    const traversal = (node: BinTreeNodeType, treeData: BinTreeNodeValue[] = []): BinTreeNodeValue[] => {
      if (!node) return treeData;
      traversal(node.left, treeData);
      traversal(node.right, treeData);
      treeData.push(node.value);
      return treeData;
    };

    return traversal(this);
  }

  levelorderTraversal(): BinTreeNodeValue[][] {
    const treeData: BinTreeNodeValue[][] = [];
    const queue: BinTreeNodeType[] = [this];
    while (queue.length) {
      const level = [];
      const levelSize = queue.length;
      for (let i = 0; i < levelSize; i += 1) {
        const node = queue.shift();
        if (node) {
          level.push(node.value);
          node.left && queue.push(node.left);
          node.right && queue.push(node.right);
        }
      }
      treeData.push(level);
    }
    return treeData;
  }
}

export function create(treeData: BinTreeData) {
  const genTree = (arr: BinTreeData = [], idx = 0): BinTreeNodeType => {
    if (arr.length === 0) return new BinTreeNode(null, null, null);
    if (idx > arr.length) return null;
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;
    if (
      arr[idx] === undefined
      && arr[left] === undefined
      && arr[right] === undefined
    ) {
      return null;
    }

    return new BinTreeNode(
      arr[idx] === undefined ? null : arr[idx],
      (arr[left] || (arr[left] === 0))
        ? genTree(arr, left)
        : undefined,
      (arr[right] || (arr[right] === 0))
        ? genTree(arr, right)
        : undefined,
    );
  };
  return genTree(treeData);
}
export function splitTree(tree: BinTreeNodeType) {
  if (!tree) return -1;
  return {
    root: tree,
    L: tree.left,
    R: tree.right,
  };
}

export function print(...rest: Parameters<typeof binTreePrinter>) {
  return binTreePrinter(...rest);
}
const BinTree = {
  create,
  splitTree,
  print,
};

export default BinTree;