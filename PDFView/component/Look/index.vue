<template>
	<div class="wrapper flex-1">
		<div class="content">
			<!-- 展示容器 -->
			<div class="left-box" :ref="refs.wrapper" @wheel.prevent="scaleWheel($event)">
				<div class="box" :ref="refs.box" @mousedown="dragstart($event)">
					<vue-pdf-embed :source="source" :style="scaleFun" class="vue-pdf-embed" :page="activePage" ref="vuePdfEmbedRef" />
				</div>
				<div class="zoomin-wrapper">
					<Icon class="icon shadow-md" color="#BAB9BA" icon="typcn:zoom-in-outline" @click="rollBtn('enlarge')" />
					<Icon class="icon shadow-md" color="#BAB9BA" icon="typcn:zoom-out-outline" @click="rollBtn('zoomin')" />
					<Icon class="icon shadow-md" color="#BAB9BA" icon="mingcute:rotate-to-vertical-line" @click="rotate" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import { Icon } from "@iconify/vue";
import type { Props } from "./types";
import { useDebounceFn } from "@vueuse/core";
const props = defineProps<Props>();
const scale = defineModel<number>("scale");
const vuePdfEmbedRef = ref(); // vue-pdf-embed的Ref
// 实现pdf缩放
const scaleFun = computed(() => {
	return `transform:scale(${scaleData.scale});transition: all 0.3s;`;
});
const refs = {
	wrapper: ref<HTMLElement | null>(null), // pdf外层容器
	box: ref<HTMLElement | null>(null), // pdf容器，用于拖拽
};
const dragData = reactive({
	x: 0, // 拖拽初始化时的x坐标
	y: 0, // 拖拽初始化时的y坐标
	left: 0, // 拖拽结束时的x偏移量
	top: 0, // 拖拽结束时的y偏移量
	firstX: 0, // 初始x坐标
	firstY: 0, // 初始y坐标
});
const scaleData = reactive({
	scale: 1, // 缩放比例
	scaleNum: 0.1, // 滚轮缩放比例
	scaleMax: 100, // 最大缩放比例
	scaleMin: 0.1, // 最小缩放比例
	scaleBtn: 0.4, // 缩放按钮缩放比例
	rotate: 0, // 旋转角度
});

const initScale = () => {
	// 重置pdf大小和位置
	scaleData.scale = scale.value;
	scaleData.rotate = 0;
	refs.box.value.style.left = "50%";
	refs.box.value.style.top = "50%";
	boxTransform();
};
onMounted(() => {
	initScale();
});
watch(
	() => props.activePage,
	(v) => {
		initScale();
	},
);
const debouncedUpdateScale = useDebounceFn((value) => {
	scale.value = value;
}, 500);
// box 容器也要跟着变化
const boxTransform = () => {
	refs.box.value.style.transform = `translate(-50%, -50%) rotate(${scaleData.rotate}deg) scale(${scaleData.scale})`;
	debouncedUpdateScale(scaleData.scale);
};

// 旋转
const rotate = () => {
	scaleData.rotate += 90;
	boxTransform();
};

// 鼠标滚轮缩放
function scaleWheel(e: any) {
	let dy = -e.deltaY || e.wheelDeltaY;
	if (dy < 0) {
		scaleData.scale -= scaleData.scaleNum;
	} else {
		// console.log('放大');
		scaleData.scale += scaleData.scaleNum;
	}
	// 边界判断
	if (scaleData.scale >= scaleData.scaleMax) {
		scaleData.scale = scaleData.scaleMax;
		return;
	}
	if (scaleData.scale <= scaleData.scaleMin) {
		scaleData.scale = scaleData.scaleMin;
		return;
	}
	boxTransform();
	return false;
}

// 点击放大缩小
const rollBtn = (action: "enlarge" | "zoomin") => {
	if (action === "enlarge") {
		scaleData.scale += scaleData.scaleBtn;
	} else {
		scaleData.scale -= scaleData.scaleBtn;
	}
	// 边界判断
	if (scaleData.scale >= scaleData.scaleMax) {
		scaleData.scale = scaleData.scaleMax;
		return;
	}
	if (scaleData.scale <= scaleData.scaleMin) {
		scaleData.scale = scaleData.scaleMin;
		return;
	}
	boxTransform();
};

// 拖拽（box容器拖拽）
function dragstart(e: MouseEvent) {
	refs.box.value.style.transition = "none";
	e.preventDefault(); // 阻止默认事件
	const box = refs.box.value as HTMLElement;
	const wrapper = refs.wrapper.value as HTMLElement;
	dragData.x = e.pageX - box.offsetLeft;
	dragData.y = e.pageY - box.offsetTop;

	// 添加鼠标移动事件
	document.addEventListener("mousemove", move);
	function move(event: any) {
		// 计算元素的位置
		dragData.left = event.pageX - dragData.x;
		dragData.top = event.pageY - dragData.y;
		// 边界判断可以在这里添加 ↓

		// 设置元素的位置
		box.style.left = dragData.left + "px";
		box.style.top = dragData.top + "px";
	}
	// 添加鼠标抬起事件，鼠标抬起，将事件移除
	document.addEventListener("mouseup", function () {
		document.removeEventListener("mousemove", move);
	});
	// 鼠标离开父级元素，把事件移除
	document.addEventListener("mouseout", function () {
		document.removeEventListener("mousemove", move);
	});
}

defineExpose({
	print: (allPage: boolean) => {
		//组件源码设置的即为300
		vuePdfEmbedRef.value.print(300, "", allPage);
	},
	download: () => {
		vuePdfEmbedRef.value.download();
	},
});
</script>

<style scoped lang="scss">
.wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #000000;
	overflow: hidden;
	.content {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		background-color: #000000;
		display: flex;
		overflow: hidden;

		.left-box {
			width: 100%;
			height: 100%;
			background-color: #525659;
			position: relative;
			overflow: hidden;
			.box {
				width: 80%;
				height: 100%;
				object-fit: contain;
				user-select: none; /* 不可选中,为了拖拽时不让文字高亮 */
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				display: flex;
				align-items: center;
				justify-content: center;
				.vue-pdf-embed {
					width: 100%;
				}
			}
			.zoomin-wrapper {
				position: absolute;
				top: 50%;
				right: 20px;
				transform: translateY(-50%);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.icon {
					cursor: pointer;
					margin: 5px 0;
					border-radius: 50%;
					font-size: 26px;
				}
				//img {
				//	width: 34px;
				//	height: 34px;
				//	cursor: pointer;
				//	margin: 5px 0;
				//}
			}
			.center {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			.bottom-left {
				position: absolute;
				bottom: 20px;
				left: 20px;
			}
		}
		.right-box {
			width: 50%;
			height: 100%;
			background-color: #000000;
			margin-left: 10px;
			padding: 10px 0;
			overflow-y: scroll;
			//   修改滚动条
			&::-webkit-scrollbar {
				width: 10px;
			}
			&::-webkit-scrollbar-thumb {
				background: #333333;
				border-radius: 10px;
			}
			.item {
				min-height: 48px;
				display: flex;
				padding-right: 50px;
				& + .item {
					margin-top: 10px;
				}
				.label {
					width: 100px;
					min-height: 48px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #ffffff;
					font-size: 14px;
					font-weight: 600;
					padding: 0 5px;
				}
				.text {
					flex: 1;
					color: #ffffff;
					background-color: #262626;
					border-radius: 10px;
					font-size: 14px;
					font-weight: 600;
					line-height: 24px;
					padding: 10px 20px;
				}
			}
		}
	}
}
</style>
