import { BTree } from './btree';
import { KeyValueCell, PointerCell } from './cell';
import { PAGE_SIZE } from './constants';

export const enum PageType {
  EMPTY = 0x00,
  LEAF = 0x0d,
  INTERNAL = 0x05,
}

/**
 * Every page is a b tree node, search from root node, read one page from 
 * disk to RAM each time. All pointers store to the internal node, all data 
 * store to the leaf node.
 * BTreeNode(Page)
 * 0        8           freeStart       cellAreaStart           4096
 * +--------+---------------+-----------------+-------------------+
 * | header | cell_pointers |    free_space   | cell_content_area |
 * +--------+---------------+-----------------+-------------------+
 *     |
 *     v
 * PageHeader
 * 0           1            3                 5          8
 * +-----------+------------+-----------------+----------+
 * |   [int]   |    [int]   |      [int]      |          |
 * | page_type |            |                 |          |
 * |0x00: EMPTY| free_start | cell_area_start | reserved |
 * |0x05:INTERN|            |                 |          |
 * |0x0d: LEAF |            |                 |          |
 * +-----------+------------+-----------------+----------+
 */
export class BTreeNode {
  static readonly HEADER_SIZE = 8;
  static readonly DEFAULT_FREE_START = 8;
  static readonly DEFAULT_CELL_START = PAGE_SIZE;
  static readonly CELL_AREA_END = PAGE_SIZE;
  static readonly CELL_POINTER_SIZE = 2;

  static isEqualKey(a: Buffer, b: Buffer) {
    return Buffer.compare(a, b) === 0;
  }

  static createEmptyHeader(): Buffer {
    const buf = Buffer.alloc(BTreeNode.HEADER_SIZE);
    buf.writeInt8(PageType.EMPTY, 0);
    buf.writeUInt16BE(BTreeNode.DEFAULT_FREE_START, 1);
    buf.writeUInt16BE(BTreeNode.DEFAULT_CELL_START, 3);
    return buf;
  }

  readonly id: number;
  readonly buffer: Buffer;

  constructor(id: number, rawBuffer: Buffer) {
    this.id = id;
    this.buffer = rawBuffer;
  }

  private get pageType(): PageType {
    return this.buffer.readInt8(0);
  }

  private set pageType(type: PageType) {
    this.buffer.writeUInt8(type);
  }

  private get freeStart(): number {
    return this.buffer.readInt16BE(1);
  }

  private set freeStart(start: number) {
    this.buffer.writeUInt16BE(start, 1);
  }

  private get cellAreaStart(): number {
    return this.buffer.readInt16BE(3);
  }

  private set cellAreaStart(start: number) {
    this.buffer.writeUInt16BE(start, 3);
  }

  private get cellOffsets(): number[] {
    let i = BTreeNode.HEADER_SIZE;
    const buf = this.buffer;
    const offsets: number[] = [];

    while (i < this.freeStart) {
      const offset = buf.readInt16BE(i);
      offsets.push(offset);
      i += BTreeNode.CELL_POINTER_SIZE;
    }

    return offsets;
  }

  private set cellOffsets(offsets: number[]) {
    const cellPointers = Buffer.concat(
      offsets.map(offset => {
        const buf = Buffer.alloc(BTreeNode.CELL_POINTER_SIZE);
        buf.writeInt16BE(offset);
        return buf;
      })
    );
    cellPointers.copy(this.buffer, BTreeNode.HEADER_SIZE);
  }

  private insertCell(cell: PointerCell | KeyValueCell): void {
    const pointers = this.cellOffsets;
    const offset = cell.offset;

    const index = findIndexOfFirstGreaterElement(
      pointers,
      cell.key,
      (a, b) => Buffer.compare(this.readCellByPointer(a)!.key, b),
    );

    if (index === -1) {
      const cl = this.readCellByIndex(-1);
      if (cl && BTreeNode.isEqualKey(cl.key, cell.key)) {
        pointers.pop();
      }
      pointers.push(offset);
    } else if (index === 0) {
      pointers.unshift(offset);
    } else {
      const cl = this.readCellByIndex(index - 1);
      if (cl && BTreeNode.isEqualKey(cl.key, cell.key)) {
        // replace it if it was equal
        pointers.splice(index - 1, 1, offset);
      } else {
        // otherwise put it after i - 1 position
        pointers.splice(index, 0, offset);
      }
    }

    cell.buffer.copy(this.buffer, this.cellAreaStart - cell.size);

    this.cellOffsets = pointers;
    this.freeStart = this.freeStart + BTreeNode.CELL_POINTER_SIZE;
    this.cellAreaStart = offset;
  }

  private readCellByPointer(pointer: number): PointerCell | KeyValueCell | null {
    const buf = this.buffer;
    if (this.isInternalNode()) {
      const keySize = buf.readInt32BE(pointer);
      const size = PointerCell.calcSize(keySize);
      const cellBuf = buf.subarray(pointer, pointer + size);
      return new PointerCell(cellBuf, pointer);
    } else if (this.isLeafNode()) {
      const keySize = buf.readInt32BE(pointer + 1);
      const valueSize = buf.readInt32BE(pointer + 5);
      const size = KeyValueCell.calcSize(keySize, valueSize);
      const cellBuf = buf.subarray(pointer, pointer + size);
      return new KeyValueCell(cellBuf, pointer);
    }
    return null;
  }

  private readCellByIndex(index: number): PointerCell | KeyValueCell | null {
    const pointer = this.cellOffsets.at(index);
    if (typeof pointer === 'undefined') return null;
    return this.readCellByPointer(pointer);
  }

  private readCellByKey(key: Buffer): PointerCell | KeyValueCell | null {
    let index = findIndexOfFirstGreaterElement(
      this.cellOffsets,
      key,
      (a, b) => Buffer.compare(this.readCellByPointer(a)!.key, b),
    );

    if (index === 0) return null; // first key is greater
    else if (index > 0) {
      // the one at index is greater, try compare it with previous one
      index--;
    } else {
      // none of the keys are greater, try compare it with last one
      index = -1;
    }

    const cell = this.readCellByIndex(index);
    if (cell && BTreeNode.isEqualKey(cell.key, key)) return cell;
    return null;
  }

  findSubtreeOrLeaf(key: Buffer): BTreeNode | number {
    if (this.isInternalNode()) {
      const index = findIndexOfFirstGreaterElement(
        this.cellOffsets,
        key,
        (a, b) => Buffer.compare(this.readCellByPointer(a)!.key, b),
      );

      let cell: PointerCell;
      if (index === -1 || index === 0) {
        // the key is greater than or equal to last element or lesser than the first element
        cell = this.readCellByIndex(index) as PointerCell;
      } else {
        // the key is lesser than the element at index
        cell = this.readCellByIndex(index - 1) as PointerCell;
      }
      return cell.childPageId;
    }
    // newly created root node or leaf node
    return this;
  }

  insertKeyValueCell(key: Buffer, value: Buffer): void {
    if (this.isEmptyNode()) {
      this.pageType = PageType.LEAF;
    }
    const size = KeyValueCell.calcSize(key.length, value.length);
    const offset = this.cellAreaStart - size;
    const cell = KeyValueCell.create(key, value, offset);
    this.insertCell(cell);
  }

  findKeyValueCell(key: Buffer): KeyValueCell | null {
    if (!this.isLeafNode()) return null;

    return (this.readCellByKey(key) as KeyValueCell) ?? null;
  }

  insertPointerCell(key: Buffer, pointer: number): void {
    if (this.isEmptyNode()) {
      this.pageType = PageType.INTERNAL;
    }
    const size = PointerCell.calcSize(key.length);
    const offset = this.cellAreaStart - size;
    const cell = PointerCell.create(key, pointer, offset);
    this.insertCell(cell);
  }

  /**
   * 1. Allocate a new node.
   * 2. Copy half the elements from the splitting node to the new one.
   * 3. Place the new element into the corresponding node.
   * 4. At the parent of the split node, add a separator key and a pointer to the new node.
   */
  splitAndInsert(key: Buffer, valueOrPointer: Buffer | number, btree: BTree): void {
    const [id, buffer] = btree.pager.allocNewPage();
    const newNode = new BTreeNode(id, buffer);
    const pointers = this.cellOffsets;

    // Copy latter half of cells to new node
    const latterHalfOfPointers = pointers.slice(Math.floor(pointers.length / 2));
    for (const p of latterHalfOfPointers) {
      if (this.isInternalNode()) {
        const cell = this.readCellByPointer(p) as PointerCell;
        newNode.insertPointerCell(cell.key, cell.childPageId);
      } else if (this.isLeafNode()) {
        const cell = this.readCellByPointer(p) as KeyValueCell;
        newNode.insertKeyValueCell(cell.key, cell.value);
      }
    }

    // Only keep former half of cells in current node, this will reset buffer
    const formerHalfOfPointers = pointers.slice(0, Math.floor(pointers.length / 2));
    const buf = Buffer.concat(
      formerHalfOfPointers.map(p => this.readCellByPointer(p)!.buffer)
    );
    // reset all cells
    this.buffer.fill(0, this.cellAreaStart, BTreeNode.CELL_AREA_END);
    buf.copy(this.buffer, BTreeNode.DEFAULT_CELL_START - buf.length);
    this.cellOffsets = formerHalfOfPointers;
    this.freeStart =
      BTreeNode.DEFAULT_FREE_START +
      BTreeNode.CELL_POINTER_SIZE * formerHalfOfPointers.length;
    this.cellAreaStart = BTreeNode.DEFAULT_CELL_START - buf.length;

    // Place the new element into the corresponding node.
    if (Buffer.compare(key, newNode.firstKey()) === -1) {
      if (this.isLeafNode()) {
        this.insertKeyValueCell(key, valueOrPointer as Buffer);
      } else if (this.isInternalNode()) {
        this.insertPointerCell(key, valueOrPointer as number);
      }
    } else {
      if (this.isLeafNode()) {
        newNode.insertKeyValueCell(key, valueOrPointer as Buffer);
      } else if (this.isInternalNode()) {
        newNode.insertPointerCell(key, valueOrPointer as number);
      }
    }

    const parent = btree.cursor.prev();
    if (!parent) {
      // current node is root node
      btree.createRootAndIncreaseHeight(newNode);
      btree.saveNodeToFile(this);
      btree.saveNodeToFile(newNode);
    } else if (parent.canHold(newNode.firstKey(), null)) {
      // parent node can hold pointer to new node
      parent.insertPointerCell(newNode.firstKey(), newNode.id);
      btree.saveNodeToFile(parent);
      btree.saveNodeToFile(this);
      btree.saveNodeToFile(newNode);
      if (parent.id === btree.root?.id) {
        btree.root = parent;
      }
    } else {
      // parent node does not have enough space to hold pointer to new node
      // should keep split and propagate
      parent.splitAndInsert(newNode.firstKey(), newNode.id, btree);
    }
  }

  canHold(key: Buffer, value: Buffer | null): boolean {
    return (this.cellAreaStart - this.freeStart) >
      (BTreeNode.CELL_POINTER_SIZE +
        (value
          ? KeyValueCell.calcSize(key.length, value.length)
          : PointerCell.calcSize(key.length)
        )
      );
  }

  firstKey(): Buffer {
    return this.readCellByIndex(0)!.key;
  }

  lastKey(): Buffer {
    return this.readCellByIndex(this.cellOffsets.length - 1)!.key;
  }

  keys(): Buffer[] {
    return this.cellOffsets.map(p => this.readCellByPointer(p)!.key);
  }

  keyAt(i: number): Buffer | null {
    return this.readCellByIndex(i)?.key ?? null;
  }

  keyCount(): number {
    return this.cellOffsets.length;
  }

  isEmptyNode(): boolean {
    return this.pageType === PageType.EMPTY;
  }

  isLeafNode(): boolean {
    return this.pageType === PageType.LEAF;
  }

  isInternalNode(): boolean {
    return this.pageType === PageType.INTERNAL;
  }
}

export function findIndexOfFirstGreaterElement<T, K>(
  array: T[],
  target: K,
  comparator: (current: T, target: K, currentIndex?: number, arr?: T[]) => number
): number {
  let start = 0;
  let end = array.length - 1;
  let index = -1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    const compare = comparator(array[mid], target, mid, array);

    if (compare <= 0) {
      // target is greater then move to right side
      start = mid + 1;
    } else {
      // move to left side
      index = mid;
      end = mid - 1;
    }
  }

  return index;
}