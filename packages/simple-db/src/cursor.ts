import { BTreeNode } from './btreenode';
import { Pager } from './pager';

export class Cursor {
  // store the passed node id
  private breadcrumbs: number[] = [];
  // mark current position
  private index: number = -1;
  private readonly pager: Pager;

  constructor(pager: Pager) {
    this.pager = pager;
  }

  private addBreadcrumbs(bread: number): void {
    this.breadcrumbs.push(bread);
    this.index++;
  }

  reset(): void {
    this.breadcrumbs = [];
    this.index = -1;
  }

  getRoot(): BTreeNode | null {
    const [id, buf] = this.pager.readRootPage();
    if (!buf) return null;

    return new BTreeNode(id, buf);
  }

  findLeafNodeByKey(startNode: BTreeNode, key: Buffer): BTreeNode {
    this.addBreadcrumbs(startNode.id);

    let nodeOrPointer = startNode.findSubtreeOrLeaf(key);

    while (typeof nodeOrPointer === 'number') {
      const buf = this.pager.readPageById(nodeOrPointer);
      startNode = new BTreeNode(nodeOrPointer, buf);
      this.addBreadcrumbs(startNode.id);
      nodeOrPointer = startNode.findSubtreeOrLeaf(key);
    }

    return nodeOrPointer;
  }

  prev(): BTreeNode | null {
    if (this.index === 0) return null;

    const id = this.breadcrumbs.at(this.index - 1);

    if (typeof id === 'undefined') return null;

    const buf = this.pager.readPageById(id);
    this.index--;
    return new BTreeNode(id, buf);
  }
}
