import { Pager } from './pager';
import { Cursor } from './cursor';
import { BTreeNode } from './btreenode';

export class BTree {
  readonly pager: Pager;
  readonly cursor: Cursor;

  root: BTreeNode | null = null;

  constructor(pager: Pager, cursor: Cursor) {
    this.pager = pager;
    this.cursor = cursor;
    this.root = this.cursor.getRoot();
  }

  saveNodeToFile(node: BTreeNode): void {
    this.pager.writePageById(node.id, node.buffer);
  }

  createRootAndIncreaseHeight(newChildNode: BTreeNode): void {
    const [id, buf] = this.pager.allocNewPage();
    const newRoot = new BTreeNode(id, buf);
    newRoot.insertPointerCell(this.root!.lastKey(), this.root!.id);
    newRoot.insertPointerCell(newChildNode.firstKey(), newChildNode.id);
    this.root = newRoot;
    this.saveNodeToFile(newRoot);
    this.pager.setRootPage(id/* , newRoot.buffer */);
  }

  find(key: Buffer): Buffer | null {
    if (!this.root) return null;

    this.cursor.reset();
    const node = this.cursor.findLeafNodeByKey(this.root, key);
    return node.findKeyValueCell(key)?.value ?? null;
  }

  insert(key: Buffer, value: Buffer): void {
    if (!this.root) {
      const [id, buf] = this.pager.allocNewPage();
      this.root = new BTreeNode(id, buf);
      this.pager.setRootPage(id/* , buf */);
    }

    this.cursor.reset();
    const node = this.cursor.findLeafNodeByKey(this.root, key);

    if (node.canHold(key, value)) {
      node.insertKeyValueCell(key, value);
      this.saveNodeToFile(node);
    } else {
      node.splitAndInsert(key, value, this);
    }
  }
}