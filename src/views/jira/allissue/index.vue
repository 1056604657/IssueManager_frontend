<template>
    <fs-page>
      <div class="issue-container">
        <div class="issue-header">
          <div class="left-btns">
            <el-form :inline="true" :model="formSearch" class="demo-form-inline">
              <el-form-item label="所属项目">
                <el-select v-model="formSearch.project_id" clearable >
                  <el-option v-for="project in projectOptions" :key="project.id" :label="project.name" :value="project.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="issue名">
                <el-input v-model="formSearch.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="issue状态">
                <el-select v-model="formSearch.status"  clearable>
                  <el-option v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="筛选时间">
                <el-date-picker
                  v-model="formSearch.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD" 
                  @change="onDateRangeChange">
              </el-date-picker>
              </el-form-item>

              
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
                <el-button type="primary" @click="onExport">导出数据</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="right-btns">
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
                      <template v-if="curIssueDetail&&curIssueDetail.question_reason">
                      <div class="issue-sub-title">
                      <div class="divider-text">备注</div>
                    </div>
                    <div class="question-detail">
                      <el-row :gutter="20">
                        <el-col :span="24" class="question-item">
                          <div class="question-label">问题原因:</div>
                          <div class="question-value">
                            {{ curIssueDetail.question_reason }}
                          </div>
                        </el-col>
                        <el-col :span="24" class="question-item">
                          <div class="question-label">解决方法:</div>
                          <div class="question-value">
                            {{ curIssueDetail.resolve_method}}
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </template>
                      <div class="issue-sub-title">
                        <div class="divider-text">操作</div>
                      </div>
                      <div class="contorl-btns">
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
                        <div class="label">确认时间:</div>
                        <div class="value">
                          {{ curIssueDetail.pending_datetime || "-" }}
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
                              ? curIssueDetail.expected_hours + "分钟"
                              : "-"
                          }}
                        </div>
                      </div>
                      <div class="date-item">
                        <div class="label">实际消耗</div>
                        <div class="value">
                          {{
                            curIssueDetail.actual_hours
                              ? curIssueDetail.actual_hours + "分钟"
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
              <template #append>分钟</template>
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
              <template #append>分钟</template>
            </el-input>
          </el-form-item>
          <el-form-item label="问题原因" prop="comment" >
        <el-input type="textarea" autosize v-model="resolveForm.comment" ></el-input>
      </el-form-item>

      <el-form-item label="解决方法" prop="solution" >
          <el-input type="textarea" autosize v-model="resolveForm.solution" ></el-input>
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
  <script  setup name="myissue">
  import * as api from './api';
  import { storeToRefs } from 'pinia'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import Editor from '/@/components/editor/index.vue'
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
  let formSearch=ref({
    name:'',
    project_id:'',
    status:'',
    dateRange:[]
  })
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
    let query = JSON.parse(JSON.stringify(formSearch.value));
    if(query.status == 3){
      query.status = '';
      query.out_date = true;
    }
    if(!query.status){
      delete query.status;
    }

    // 检查 dateRange 是否有值
    if (formSearch.value.dateRange && formSearch.value.dateRange.length === 2) {
      // 将开始日期和结束日期添加到查询对象中
      query.start_date = formSearch.value.dateRange[0];
      query.stop_date = formSearch.value.dateRange[1];
    } else {
      // 如果没有选择日期范围，则确保查询对象中不包含开始和结束日期
      delete query.start_date;
      delete query.stop_date;
    }

    api.getAllIssue(query).then(res => {
      issueList.value = res.data;
      if (!curIssueId.value && issueList.value.length) {
        if (setDefault) {
          curIssueId.value = issueList.value[0].id;
          getIssueDetail();
        }
      }
    });
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
  let statusOptions=[
    {
      label:'All Issues',
      value:0
    },
    {
      label:'Open Issues',
      value:1
    },
    {
      label:'Done Issues',
      value:2
    },
    {
      label:'Timeout Issues',
      value:3
    }
  ]
  let projectOptions=ref([])
  api.getProjectList().then(res=>{
    projectOptions.value=res.data
  })
  const onSubmit=()=>{
    getIssueList()
  }
  const onReset=()=>{
    formSearch.value={
      name:'',
      project_id:'',
      status:'',
      dateRange: []
    }
  }
  const onExport=()=>{
    let query=JSON.parse(JSON.stringify(formSearch.value))
    if(query.status==3){
      query.status=''
      query.out_date=true
    }
    if(!query.status){
      delete query.status
    }
    query.export=true
    if (formSearch.value.dateRange && formSearch.value.dateRange.length === 2) {
      // 将开始日期和结束日期添加到查询对象中
      query.start_date = formSearch.value.dateRange[0];
      query.stop_date = formSearch.value.dateRange[1];
    } else {
      // 如果没有选择日期范围，则确保查询对象中不包含开始和结束日期
      delete query.start_date;
      delete query.stop_date;
    }
    api.exportAllIssue(query)

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
      .el-select{
        width:200px;
      }
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