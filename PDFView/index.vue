<script setup lang="ts">
import { ref } from "vue";
import Preview from "./component/Preview/index.vue";
import Look from "./component/Look/index.vue";
import Toolbar from "./component/Toolbar/index.vue";
import { useVuePdfEmbed } from "vue-pdf-embed";
import { VxeUI } from "vxe-pc-ui";
import print from "print-js";

defineOptions({
	name: "PDFView",
});
const route = useRoute();
const LookRef = ref<InstanceType<typeof Look>>();
if (!route.query?.file) {
	VxeUI.modal.message({ content: "文件参数不存在", status: "error" });
}
const folderPreView = ref<boolean>(false);
const { doc } = useVuePdfEmbed({
	source: route.query?.file as string,
});
const activePage = ref<number>(1); // 当前页码
const scale = ref<number>(1); // 缩放比例

/**
 * 打印
 * @param allPage 是否打印全部页
 */
const printPDF = (allPage: boolean) => {
	if (allPage) {
		print({
			printable: route.query?.file,
			type: "pdf",
		});
	} else {
		LookRef.value.print(allPage);
	}
};
//下载
const downloadPDF = () => {
	LookRef.value.download();
};
</script>

<template>
	<div class="flex w-full h-full flex-col">
		<template v-if="doc">
			<Toolbar
				v-model:active-page="activePage"
				:page-total-num="doc.numPages"
				v-model:folder-preview="folderPreView"
				@print="printPDF"
				@download="downloadPDF" />
			<div class="flex w-full flex-1 h-0">
				<Preview v-show="!folderPreView" v-model:activePage="activePage" :source="doc" :page-total-num="doc.numPages" />
				<Look ref="LookRef" :source="doc" :activePage="activePage" :scale="scale" />
			</div>
		</template>
		<template v-else> <div class="w-full h-full" v-loading="true">文件载入中...</div> </template>
	</div>
</template>

<style scoped lang="scss"></style>
