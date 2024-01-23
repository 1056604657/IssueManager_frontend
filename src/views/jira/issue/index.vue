<template>
  <fs-page>
    <div class="issue-container">
      <div class="issue-header">
        <div class="left-btns">
          <div class="issue-status">{{ statusMap[status] }}</div>
          <el-popover
            placement="bottom"
            :width="200"
            trigger="focus"
            popper-class="popper-status"
            :visible="popoverVisible"
          >
            <template #reference>
              <el-button
                style="margin-left: 10px"
                text
                @click="popoverVisible = true"
                >切换过滤器<el-icon><CaretBottom /></el-icon
              ></el-button>
            </template>
            <div class="status-item" @click="changeStatus(0)">All issues</div>
            <div class="status-item" @click="changeStatus(1)">Open issues</div>
            <div class="status-item" @click="changeStatus(2)">Done issues</div>
          </el-popover>
        </div>
        <div class="right-btns">
          <el-button type="primary" @click="openAddDrawer">新增issue</el-button>
        </div>
      </div>
      <div class="issue-el-row">
        <div class="issue-box issue-left" style="width: 240px">
          <div
            class="issue-item"
            :class="{
						  active:curIssueDetail&&curIssueDetail.id==issue.id
					  }" 
            v-for="(issue, index) in issueList"
            :key="index"
            @click="clickIssueHandle(issue)"
          >
            <div class="issue-index">
              <img :src="issueIcon" class="issue-icon" />【P{{issue.priority}}】{{
                issue.signal_number
              }}
            </div>
            <div class="issue-sub">{{ issue.name }}</div>
          </div>
        </div>
        <div style="width: 100%; height: 100%" v-if="curIssueDetail">
          <el-row style="height: 100%">
            <el-col :span="24">
              <div class="issue-box issue-detail">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item>{{curIssueDetail.project_name}}</el-breadcrumb-item>
                  <el-breadcrumb-item>{{
                    curIssueDetail.signal_number
                  }}</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="issue-title">{{ curIssueDetail.name }}</div>
                <el-row :gutter="20">
                  <el-col :span="16">
                    <div class="issue-sub-title">
                      <div class="divider-text">问题详情</div>
                    </div>
                    <div class="question-detail">
                      <el-row :gutter="20">
                        <el-col :span="12" class="question-item">
                          <div class="question-label">类型:</div>
                          <div class="question-value">
                            {{ typeMap[curIssueDetail.type] }}
                          </div>
                        </el-col>
                        <el-col :span="12" class="question-item">
                          <div class="question-label">状态:</div>
                          <div
                            class="question-value status-pending"
                            v-if="
                              curIssueDetail.status == 1 &&
                              !curIssueDetail.pending_datetime
                            "
                          >
                            待办
                          </div>
                          <div
                            class="question-value status-handle"
                            v-if="
                              curIssueDetail.status == 1 &&
                              curIssueDetail.pending_datetime
                            "
                          >
                            处理中
                          </div>
                          <div
                            class="question-value status-finish"
                            v-if="curIssueDetail.status == 2"
                          >
                            已完成
                          </div>
                        </el-col>
                        <el-col :span="12" class="question-item">
                          <div class="question-label">优先级:</div>
                          <div class="question-value">
                            <img :src="priority1" class="issue-icon" />P{{
                              curIssueDetail.priority
                            }}
                          </div>
                        </el-col>
                        <el-col :span="12" class="question-item">
                          <div class="question-label">解决结果:</div>
                          <div
                            class="question-value"
                            v-if="curIssueDetail.status == 1"
                          >
                            未解决
                          </div>
                          <div
                            class="question-value"
                            v-if="curIssueDetail.status == 2"
                          >
                            已解决
                          </div>
                        </el-col>
                        <el-col :span="24" class="question-item">
                          <div class="question-label">来源:</div>
                          <div class="question-value">
                            {{ sourceMap[curIssueDetail.source] }}
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="issue-sub-title">
                      <div class="divider-text">描述</div>
                    </div>
                    <Editor
                      mode="simple"
                      :show-toolbar="false"
                      disable="true"
                      readOnly="true"
                      :getHtml="curIssueDetail.description"
                    />
                    <div class="issue-sub-title">
                      <div class="divider-text">操作</div>
                    </div>
                    <div class="contorl-btns">
                      <el-button
                        type="primary"
                        v-if="userInfos.id == curIssueDetail.creator"
                        text
                        bg
                        @click="openEditDrawer(curIssueDetail.id)"
                      >
                        <el-icon :size="size" :color="color"> <Edit /> </el-icon
                        >编辑issue</el-button
                      >
                      <el-button
                        v-if="
                          userInfos.id == curIssueDetail.assigned &&
                          curIssueDetail.status == 1 &&
                          !curIssueDetail.pending_datetime
                        "
                        type="primary"
                        @click="confirmIssue(curIssueDetail.id)"
                      >
                        <el-icon :size="size" :color="color"
                          ><Checked /></el-icon
                        >确认issue
                      </el-button>
                      <el-button
                        v-if="
                          curIssueDetail.status == 1 &&
                          curIssueDetail.pending_datetime
                        "
                        type="primary"
                        @click="resloveIssue(curIssueDetail.id)"
                      >
                        <el-icon :size="size" :color="color">
                          <Checked /> </el-icon
                        >解决issue</el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="issue-sub-title">
                      <div class="divider-text">用户</div>
                    </div>
                    <div class="date-item">
                        <div class="label">指派给:</div>
                        <div class="value">
                        <el-avatar :size="20" :src="avatarImg" />{{
                          curIssueDetail.assigned_name
                        }}
                        </div>
										</div>
                    <div class="date-item">
                      <div class="label">经办人:</div>
                      <div class="value">
                        <el-avatar :size="20" :src="avatarImg" />{{
                          curIssueDetail.modifier_name
                        }}
                      </div>
                    </div>
                    <div class="date-item" style="margin-bottom: 40px">
                      <div class="label">报告人:</div>
                      <div class="value">
                        <el-avatar :size="20" :src="avatarImg" />{{
                          curIssueDetail.creator_name
                        }}
                      </div>
                    </div>
                    <div class="issue-sub-title">
                      <div class="divider-text">日期</div>
                    </div>
                    <div class="date-item">
                      <div class="label">到期时间:</div>
                      <div class="value">
                        {{ curIssueDetail.deadline || "-" }}
                      </div>
                    </div>
                    <div class="date-item">
                      <div class="label">创建时间:</div>
                      <div class="value">
                        {{ curIssueDetail.create_datetime || "-" }}
                      </div>
                    </div>
                    <div class="date-item">
                      <div class="label">更新时间:</div>
                      <div class="value">
                        {{ curIssueDetail.update_datetime || "-" }}
                      </div>
                    </div>
                    <div class="date-item">
                      <div class="label">解决时间:</div>
                      <div class="value">
                        {{ curIssueDetail.resolve_datetime || "-" }}
                      </div>
                    </div>
                    <div style="height: 20px"></div>
                    <div class="issue-sub-title">
                      <div class="divider-text">工时信息</div>
                    </div>
                    <div class="date-item">
                      <div class="label">最初预计</div>
                      <div class="value">
                        {{
                          curIssueDetail.expected_hours
                            ? curIssueDetail.expected_hours + "工时"
                            : "-"
                        }}
                      </div>
                    </div>
                    <div class="date-item">
                      <div class="label">实际消耗</div>
                      <div class="value">
                        {{
                          curIssueDetail.actual_hours
                            ? curIssueDetail.actual_hours + "工时"
                            : "-"
                        }}
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-drawer
        v-if="addIssueDrawer"
        title="添加issue"
        v-model="addIssueDrawer"
        direction="rtl"
        size="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        ><addIssue @success="successCallback" @close="addIssueDrawer = false"
      /></el-drawer>
      <el-drawer
        v-if="editIssueDrawer"
        title="编辑issue"
        v-model="editIssueDrawer"
        direction="rtl"
        size="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        ><editIssue
          :issueId="curIssueId"
          @success="successCallback"
          @close="editIssueDrawer = false"
      /></el-drawer>
    </div>
    <el-dialog
      title="确认issue"
      v-model="confirmIssueDialogVisible"
      width="400px"
      append-to-body
    >
      <el-form :model="confirmForm" :rules="confirmRules" label-width="80px">
        <el-form-item label="开始时间" prop="pending">
          <el-date-picker
            v-model="confirmForm.pending"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="预期工时" prop="expected_hours">
          <el-input
            style="width: 220px"
            v-model.number="confirmForm.expected_hours"
            type="number"
          >
            <template #append>小时</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleConfirmCancel">取消</el-button>
          <el-button
            type="primary"
            @click="handleConfirmSave"
            :disabled="!confirmForm.pending"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="解决issue"
      v-model="resolveIssueDialogVisiable"
      width="800px"
      append-to-body
    >
      <el-form
        ref="formResolveRef"
        :model="resolveForm"
        :rules="resolveRules"
        label-width="80px"
      >
        <el-form-item label="解决时间" prop="resolve_datetime">
          <el-date-picker
            v-model="resolveForm.resolve_datetime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="实际工时" prop="actual_hours">
          <el-input
            style="width: 220px"
            v-model.number="resolveForm.actual_hours"
            oninput="value=value.replace(/[^\d]/g,'')"
            type="number"
          >
            <template #append>小时</template>
          </el-input>
        </el-form-item>
      <el-form-item label="问题原因" prop="comment" >
    <el-input v-model="resolveForm.comment" style="height: 100px;"></el-input>
</el-form-item>

<el-form-item label="解决方法" prop="solution" >
    <el-input v-model="resolveForm.solution" style="height: 100px;"></el-input>
</el-form-item>



      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSave(formResolveRef)">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </fs-page>
</template>
<script  setup name="issueList">
import * as api from './api';
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus';
import Editor from '/@/components/editor/index.vue'
import addIssue from './components/addIssue.vue';
import editIssue from './components/editIssue.vue';
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { successMessage } from '/@/utils/message';
import { useUserInfo } from '/@/stores/userInfo'
import { formatDate } from '/@/utils/formatTime';

import issueIcon from '/@/assets/issue.svg';
import avatarImg from '/@/assets/avatar.jpg';
import priority1 from '/@/assets/priority1.svg';
import priority2 from '/@/assets/priority2.svg';
import priority3 from '/@/assets/priority3.svg';
import priority4 from '/@/assets/priority4.svg';
import priority5 from '/@/assets/priority5.svg';
let statusMap = {
  0: 'All issues',
  1: 'Open issues',
  2: 'Done issues'
}
let sourceMap = {
  1: '客户提出',
  2: '内部人员发现'
}
let typeMap = {
  1: '操作体验',
  2: '功能错误',
  3: '功能缺失',
  4: '数据中断',
  5: '性能问题',
  6: '其他'
}
const route = useRoute();
const stores = useUserInfo()
const { userInfos } = storeToRefs(stores)
console.log(userInfos.value)
let projectId = route.params.id
let status = ref(1)
let addIssueDrawer = ref(false)
let editIssueDrawer = ref(false)
let issueList = ref([])
let resolveIssueDialogVisiable = ref(false)
let openAddDrawer = () => {
  addIssueDrawer.value = true
}
let openEditDrawer = (id) => {
  curIssueId.value = id
  editIssueDrawer.value = true
}
let curIssueId = ref(null)
let curIssueDetail = ref(null)
let popoverVisible = ref(null)
const getIssueList = (setDefault = true) => {
  let params = {
    project_id: projectId
  }
  if (status.value) {
    params['status'] = status.value
  }
  api.getIssueList(params).then(res => {
    issueList.value = res.data
    if (!curIssueId.value && issueList.value.length) {
      if (setDefault) {
        curIssueId.value = issueList.value[0].id
        getIssueDetail()
      }

    }
  })
}
getIssueList()
function getIssueDetail () {
  if (!curIssueId.value) {
    curIssueDetail.value = null
    return
  }
  api.getIssueDetail({
    id: curIssueId.value
  }).then(result => {
    curIssueDetail.value = result.data
  })
}

const clickIssueHandle = (issue) => {
  curIssueId.value = issue.id
  api.getIssueDetail({
    id: issue.id
  }).then(result => {
    curIssueDetail.value = result.data
  })
}
const successCallback = () => {
  addIssueDrawer.value = false
  editIssueDrawer.value = false
  updateData()
}
const changeStatus = (val) => {
  popoverVisible.value = false
  if (status.value != val) {
    curIssueId.value = null
    curIssueDetail.value = null
  }
  status.value = val
  updateData()
}
const resloveIssue = (issueId) => {
  resolveForm.value = {
    resolve_datetime: formatDate(new Date(), 'YYYY-mm-dd HH:MM:SS'),
    comment: '',
    solution: '',
    actual_hours: 0,
  }
  console.log(resolveForm.value)
  resolveIssueDialogVisiable.value = true
}
let resolveForm = ref({
  resolve_datetime: '',
  comment: '',
  solution: '',
  actual_hours: 0,
})
const resolveRules = ref({
  resolve_datetime: [
    {
      required: true,
      message: '请选择',
    },
  ],
  actual_hours: [
    {
      required: true,
      message: '请输入'
    }
  ],
  comment: [
    {
      required: true,
      message: '请输入问题原因'
    }
  ],
  solution: [
    {
      required: true,
      message: '请输入解决方法'
    }
  ]
});
const handleCancel = () => {
  resolveForm.value = ref({
    resolve_datetime: '',
    comment: '',
    solution: '',
    actual_hours: 0,
  })
  resolveIssueDialogVisiable.value = false

}
const formResolveRef = ref()
const handleSave = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      api.resolveIssue({
        id: curIssueId.value,
        resolve_datetime: resolveForm.value.resolve_datetime,
        comment: resolveForm.value.comment,
        solution: resolveForm.value.solution,
        actual_hours: resolveForm.value.actual_hours
      }).then(res => {
        resolveIssueDialogVisiable.value = false
        getIssueList(false)
        getIssueDetail()
        successMessage('保存成功');
      })
    }
  })
}
let confirmIssueDialogVisible = ref(false)
let confirmForm = ref({
  pending: '',
  expected_hours: 0
})
let confirmRules = ref({
  pending: [
    {
      required: true,
      message: '请选择'
    }
  ],
  expected_hours: [
    {
      required: true,
      message: '请输入'
    }
  ]
})

const confirmIssue = () => {
  confirmForm.value = {
    pending: formatDate(new Date(), 'YYYY-mm-dd HH:MM:SS'),
    expected_hours: 0
  }
  confirmIssueDialogVisible.value = true
}
const handleConfirmSave = () => {
  if (!confirmForm.value.expected_hours) {
    ElMessage.error('工期请输入正整数!');
    return
  }

  api.confirmIssue({
    id: curIssueDetail.value.id,
    pending: confirmForm.value.pending,
    expected_hours: confirmForm.value.expected_hours
  }).then(res => {
    updateData()
  })

  confirmIssueDialogVisible.value = false
}
const handleConfirmCancel = () => {
  confirmIssueDialogVisible.value = false
}
function updateData () {
  getIssueList()
  getIssueDetail()
}
</script>
<style lang="scss" scoped>
.issue-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
}
.issue-header {
  background-color: #fff;
  padding: 10px;
  display: flex;
  border-bottom: 1px solid rgb(193, 199, 208);
  justify-content: space-between;
  .left-btns {
    display: flex;
  }
  .issue-status {
    font-size: 20px;
    font-weight: 500;
  }
}
.issue-el-row {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;

  .el-col {
    height: 100%;
    box-sizing: border-box;
  }
}

.issue-box {
  height: 100%;
  position: relative;
  box-sizing: border-box;
}

.issue-left {
  background-color: #fff;
  padding: 10px;
  border-right: 1px solid rgb(193, 199, 208);
  height: 100%;
  overflow: auto;
  .issue-item {
    color: #3b73af;
		border-bottom: 1px solid #ccc;
    line-height: 24px;
    cursor: pointer;
    &:hover,&.active{
			.issue-index,.issue-sub{
				text-decoration: underline;
			}
		}
    .issue-index {
      display: flex;
      align-items: center;
      font-weight: 500;
      .issue-icon {
        width: 14px;
        height: 14px;
        margin-right: 4px;
      }
    }
    .issue-sub {
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.issue-detail {
  margin-left: 10px;
  background-color: #fff;
  padding: 10px;
  .issue-title {
    max-width: 80%;
    padding: 8px 0;
    line-height: 1.28;
    resize: none;
    box-shadow: transparent 0 0 0 1px;
    transition: background 0.1s ease 0s;
    overflow: auto;
    overflow-y: hidden;
    width: 100%;
    appearance: none;
    font-weight: 500;
    font-size: 24px;
  }
  .issue-sub-title {
    color: rgb(23 43 77 / 1);
    margin: 10px 0;
    display: block;
    position: relative;
    height: 1px;
    width: 100%;
    border-top: 1px #dcdfe6 solid;
    .divider-text {
      transform: translateY(-50%);
      position: absolute;
      background-color: #fff;
      padding-right: 4px;
      font-weight: 500;
      font-size: 14px;
    }
  }
  .date-item {
    display: flex;
    align-items: center;
    padding: 10px 0 0 0;
    line-height: 20px;
    .label {
      width: 100px;
      color: rgb(94, 108, 132);
    }
    .value {
      display: flex;
      align-items: center;
      .el-avatar {
        margin-right: 10px;
      }
    }
  }
  .question-item {
    display: flex;
    align-items: center;
    line-height: 32px;
    .question-label {
      width: 100px;
      color: rgb(94, 108, 132);
      font-size: 14px;
    }
    .question-value {
      display: flex;
      align-items: center;
      img {
        margin-right: 4px;
      }
    }
  }
}
.contorl-btns {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.status-pending {
  background-color: #14892c;
  border-color: #14892c;
  color: #fff;
  font-size: 10px;
  line-height: 16px;
  padding: 2px 6px;
  border-radius: 4px;
}
.status-handle {
  background-color: #409eff;
  border-color: #409eff;
  color: #ffffff;
  font-size: 10px;
  line-height: 16px;
  padding: 2px 6px;
  border-radius: 4px;
}
.status-finish {
  background-color: #ffd351;
  border-color: #ffd351;
  color: #594300;
  font-size: 10px;
  line-height: 16px;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
<style lang="scss" >
.popper-status {
  .status-item {
    cursor: pointer;
    line-height: 36px;
    font-size: 14px;
    padding-left: 10px;
    user-select: none;
    &:hover {
      background-color: #ebf5ff;
    }
  }
}
</style>