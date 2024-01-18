<template>
	<fs-page>
		<fs-crud ref="crudRef" v-bind="crudBinding"></fs-crud>
	</fs-page>
</template>

<script  setup name="project">
import { ref, onMounted } from 'vue';
import { useExpose, useCrud } from '@fast-crud/fast-crud';
import { createCrudOptions } from './crud';
import { useRouter } from 'vue-router';

const router = useRouter();
// crud组件的ref
const crudRef = ref();
// crud 配置的ref
const crudBinding = ref();
// 暴露的方法
const { crudExpose } = useExpose({ crudRef, crudBinding });


const handleIssueList = ({ id, key }) => {
  router.push(`/project/${id}/issue`);
}
onMounted(() => {
  crudExpose.doRefresh();
});

// 你的crud配置
const { crudOptions } = createCrudOptions({ crudExpose, context: { handleIssueList } });
const { resetCrudOptions } = useCrud({ crudExpose, crudOptions });
// 页面打开后获取列表数据


</script>
