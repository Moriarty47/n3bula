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
	preorderTraversal(): BinTreeNodeValue[];
	inorderTraversal(): BinTreeNodeValue[];
	postorderTraversal(): BinTreeNodeValue[];
	levelorderTraversal(): BinTreeNodeValue[][];
}
declare const BinTree: {
	create: typeof create;
	splitTree: typeof splitTree;
	print: typeof print;
};
declare function binTreePrinter(tree: BiTreeNode, options?: Partial<PrinterOptions>): string | null;
declare function create(treeData: BinTreeData): BinTreeNodeType;
declare function print(...rest: Parameters<typeof binTreePrinter>): string | null;
declare function splitTree(tree: BinTreeNodeType): -1 | {
	root: BinTreeNode;
	L: BinTreeNodeType;
	R: BinTreeNodeType;
};
export type BiTreeNode = {
	val?: number | string;
	left: BiTreeNode;
	right: BiTreeNode;
} & {
	value?: number | string;
	left: BiTreeNode;
	right: BiTreeNode;
};
export type BinTreeData = BinTreeNodeValue[];
export type BinTreeNodeType = BinTreeNode | null;
export type BinTreeNodeValue = string | number | null;
export type PrinterOptionMarks = {
	dash: string;
	lt: string;
	rt: string;
	lb: string;
	rb: string;
	joint: string;
};
export type PrinterOptions = {
	type: "line" | "slash";
	minLength: number;
	marks: PrinterOptionMarks;
};

export {
	BinTree as default,
};

