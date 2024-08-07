export interface Props {
	pageTotalNum: number; //总页
}

export interface Emit {
	(event: "print", data: boolean): void; //打印
	(event: "download"): void; //下载
}
