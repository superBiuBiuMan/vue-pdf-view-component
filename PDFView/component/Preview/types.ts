export interface Emit {
	(event: "update:activePage", index: number): void;
}

export interface Props {
	activePage: number; // 当前页
	source: any;
	pageTotalNum: number;
}
