declare const BinTree: {
    create: typeof create;
    splitTree: typeof splitTree;
    print: typeof print_2;
};
export default BinTree;

declare type BinTreeData = BinTreeNodeValue[];

declare class BinTreeNode {
    value: BinTreeNodeValue;
    left: BinTreeNodeType;
    right: BinTreeNodeType;
    constructor(value: BinTreeNodeValue, left?: BinTreeNodeType, right?: BinTreeNodeType);
    get val(): BinTreeNodeValue;
    set val(val: BinTreeNodeValue);
    print(options?: Parameters<typeof binTreePrinter>[1]): string | null;
    getSize(): number;
    getLeafNodeSize(): number;
    getLevelNodeSize(n: number): number;
    getHeight(): number;
    getDepth(): number;
    isValidBST(): boolean;
    find(data: BinTreeNodeValue): BinTreeNodeType;
    findBottomEdgeNode(direction?: 'l' | 'r'): BinTreeNodeValue;
    deleteBSTNode(data: BinTreeNodeValue): BinTreeNodeType | "Not a valid BST";
    preorderTraversal(): BinTreeNodeValue[];
    inorderTraversal(): BinTreeNodeValue[];
    postorderTraversal(): BinTreeNodeValue[];
    levelorderTraversal(): BinTreeNodeValue[][];
}

declare type BinTreeNodeType = BinTreeNode | null;

declare type BinTreeNodeValue = string | number | null;

declare function binTreePrinter(tree: BiTreeNode, options?: Partial<PrinterOptions>): string | null;

declare type BiTreeNode = {
    val?: number | string;
    left: BiTreeNode;
    right: BiTreeNode;
} & {
    value?: number | string;
    left: BiTreeNode;
    right: BiTreeNode;
};

declare function create(treeData: BinTreeData): BinTreeNodeType;

declare function print_2(...rest: Parameters<typeof binTreePrinter>): string | null;

declare type PrinterOptionMarks = {
    dash: string;
    lt: string;
    rt: string;
    lb: string;
    rb: string;
    joint: string;
};

declare type PrinterOptions = {
    type: 'line' | 'slash';
    minLength: number;
    marks: PrinterOptionMarks;
};

declare function splitTree(tree: BinTreeNodeType): -1 | {
    root: BinTreeNode;
    L: BinTreeNodeType;
    R: BinTreeNodeType;
};

export { }
