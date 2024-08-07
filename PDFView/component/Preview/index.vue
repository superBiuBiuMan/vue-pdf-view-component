<template>
	<div class="pdf-view-list">
		<div class="item active-item" v-for="(item, index) in pageTotalNum" @click="itemClcik(index)">
			<div class="pdf-box">
				<vue-pdf-embed :source="source" class="vue-pdf-embed" :page="index + 1" />
			</div>
			<div class="page">{{ index + 1 }}</div>
			<div class="mask" :class="{ active: activePage === index + 1 }"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Emit, Props } from "./types";
withDefaults(defineProps<Props>(), {
	pageTotalNum: 0,
});
const emits = defineEmits<Emit>();

// 更新当前页
const itemClcik = (index: number) => {
	emits("update:activePage", index + 1);
};
</script>

<style scoped lang="scss">
.pdf-view-list {
	width: 186px;
	height: 100%;
	background-color: #333333;
	overflow-y: scroll;
	// 隐藏滚动条
	//&::-webkit-scrollbar {
	//	display: none;
	//}
	.item {
		width: 100%;
		height: 260px;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 20px 20px 0 20px;
		cursor: pointer;
		.pdf-box {
			width: 140px;
			height: 203px;
			background: #ffffff;
			border-radius: 4px;
			z-index: 1;
			.vue-pdf-embed {
				width: 100%;
				height: 100%;
			}
		}
		.page {
			font-weight: 600;
			font-size: 12px;
			color: #ffffff;
			line-height: 34px;
			z-index: 1;
		}
		.mask {
			width: 100%;
			height: 100%;
			background-color: transparent;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 0;
		}
		.active {
			background-color: #8ab4f8;
			opacity: 0.2;
		}
	}
}
</style>
