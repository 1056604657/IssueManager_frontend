<template>
  <div style="padding: 20px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="项目" prop="project_id">
        <el-select v-model="form.project_id" placeholder="请选择项目" clearable>
          <el-option
            :label="item.label"
            :value="item.value"
            :key="index"
            v-for="(item, index) in projects"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题类型" prop="type">
        <el-select v-model="form.type" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主题" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-select v-model="form.priority" clearable>
          <el-option
            v-for="item in priorityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="到期日" prop="deadline">
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <Editor mode="simple" v-model:getHtml="form.description" />
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-select v-model="form.source" clearable>
          <el-option
            v-for="item in sourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="指派" prop="assigned_id">
        <el-select v-model="form.assigned_id" clearable>
          <el-option
            v-for="item in assignedOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formRef)"
          >立即创建</el-button
        >
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup >
import Editor from '/@/components/editor/index.vue';
import * as api from '../api';
import { ref, reactive, inject } from 'vue';
import { useRoute } from 'vue-router';
import { successMessage } from '/@/utils/message';

let projects = ref([]);
let typeOptions = ref([
  {
    label: '操作体验',
    value: 1,
  },
  {
    label: '功能错误',
    value: 2,
  },
  {
    label: '功能缺失',
    value: 3,
  },
  {
    label: '数据中断',
    value: 4,
  },
  {
    label: '性能问题',
    value: 5,
  },
  {
    label: '其他',
    value: 6,
  },
]);
let priorityOptions = ref([
  {
    label: 'P1',
    value: 1,
  },
  {
    label: 'P2',
    value: 2,
  },
  {
    label: 'P3',
    value: 3,
  },
  {
    label: 'P4',
    value: 4,
  },
  {
    label: 'P5',
    value: 5,
  }
]);
let assignedOptions = ref([])
let sourceOptions = ref([
  {
    label: '客户提出',
    value: 1,
  },
  {
    label: '内部人员发现',
    value: 2
  }
]);
let form = ref({
  project_id: null,
  type: 6,
  name: '',
  priority: 1,
  expired: '',
  description: '',
  source: '',
  assigned_id: null
});
const formRef = ref();
const rules = reactive({
  topic: [
    {
      required: true,
      message: '请输入',
    },
  ],
  name: [
    {
      required: true,
      message: '请输入',
    },
  ],
  source: [
    {
      required: true,
      message: '请选择',
    },
  ],
  assigned_id: [
    {
      required: true,
      message: '请选择',
    },
  ]
});
const route = useRoute();
let projectId = ref(route.params.id)
api.getUserList().then(res => {
  console.log(res)
  assignedOptions.value = res.data.map(item => {
    return {
      label: item.name,
      value: item.id
    }
  })
})
api.geProjectList().then((result) => {
  projects.value = result.data.map(item => {
    return {
      label: item.name,
      value: item.id
    }
  })
  let target = result.data.find(item => item.id == projectId.value)
  if (target) {
    form.value.project_id = target.id
  }
});

const refreshView = inject('refreshView');
const emit = defineEmits(['success'])
const onSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let data = {
        project_id: form.value.project_id,
        type: form.value.type,
        name: form.value.name,
        priority: form.value.priority,
        deadline: form.value.deadline,
        description: form.value.description,
        source: form.value.source,
        assigned_id: form.value.assigned_id
      }
      api.addIssue(data).then((res) => {
        if (res.code == 2000) {
          successMessage('新增成功');
          emit('success')
        }
      });
    } else {
      console.log('error submit!', fields);
    }
  });
};
const onCancel = () => {
  emit('close')
}
</script>

<style></style>
