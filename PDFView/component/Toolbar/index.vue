<script setup lang="ts">
import { ref } from "vue";
import type { Emit, Props } from "./types";
import { Icon } from "@iconify/vue";
const emit = defineEmits<Emit>();
const props = defineProps<Props>();
const activePage = defineModel("activePage", {
	default: 0,
});
const folderPreview = defineModel("folderPreview", {
	default: false,
});
const handlePagePrev = () => {
	if (activePage.value !== 1) {
		activePage.value = activePage.value - 1;
	}
};
const handlePageNext = () => {
	if (activePage.value !== props.pageTotalNum) {
		activePage.value = activePage.value + 1;
	}
};

//折叠
const handleFold = () => {
	folderPreview.value = !folderPreview.value;
};

const handleInputBlur = (event: any) => {
	const num = Number(event.target.value);
	if (!isNaN(num)) {
		activePage.value = num <= 0 ? 1 : num > props.pageTotalNum ? props.pageTotalNum : num;
	}
};
</script>

<template>
	<div class="toolbar h-12 flex leading-12 items-center">
		<!--折叠-->
		<div class="w-10 mx-4">
			<el-tooltip effect="dark" content="折叠" placement="bottom">
				<Icon icon="ep:operation" class="cursor-pointer" width="18px" @click="handleFold" />
			</el-tooltip>
		</div>
		<!--缩放页数-->
		<div class="mx-auto flex">
			<!--页数-->
			<div class="flex items-center text-sm mr-4">
				<input type="text" class="pageInput" @blur="handleInputBlur" :value="activePage" ref="inputRef" />
				<span class="mx-1">/</span><span>{{ pageTotalNum }}</span>
			</div>
			<!--上一页、下一页-->
			<div class="flex items-center">
				<el-tooltip effect="dark" content="上一页" placement="bottom">
					<Icon icon="ep:arrow-left" class="cursor-pointer" @click="handlePagePrev" :color="activePage === 1 ? 'gray' : 'white'" />
				</el-tooltip>
				<el-tooltip effect="dark" content="下一页" placement="bottom">
					<Icon icon="ep:arrow-right" class="cursor-pointer" @click="handlePageNext" :color="activePage === pageTotalNum ? 'gray' : 'white'" />
				</el-tooltip>
			</div>
		</div>
		<!--打印下载-->
		<div class="flex gap-4 mr-4">
			<el-tooltip effect="dark" content="打印" placement="bottom">
				<Icon icon="ph:printer" class="cursor-pointer" width="20px" height="20px" @click="emit('print', true)" />
			</el-tooltip>
			<el-tooltip effect="dark" content="打印当前页" placement="bottom">
				<Icon icon="ph:blueprint" class="cursor-pointer" width="20px" height="20px" @click="emit('print', false)" />
			</el-tooltip>
			<el-tooltip effect="dark" content="下载" placement="bottom">
				<Icon icon="ph:download" class="cursor-pointer" width="20px" height="20px" @click="emit('download')" />
			</el-tooltip>
		</div>
	</div>
</template>

<style scoped lang="scss">
.toolbar {
	background-color: #323639;
	color: white;
	user-select: none;
	:deep(.vxe-input) {
		height: 20px;
		line-height: 20px;
	}
	.pageInput {
		background-color: #191b1c;
		width: 40px;
		text-align: center;
		line-height: 24px;
		color: white;
		&:focus {
			outline: none;
		}
	}
}
</style>
