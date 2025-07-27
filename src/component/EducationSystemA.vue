<template>
    <div class="container">
        <div class="actions">
            <button class="add-table-btn" @click="addParentTable">
                + 新增项目
            </button>
        </div>

        <div v-if="parentTables.length === 0" class="empty-state">
            <i class="el-icon-document"></i>
            <h3>暂无项目数据</h3>
            <p>点击上方按钮添加第一个项目表格</p>
        </div>

        <div v-else class="carousel-container">
            <div class="carousel-track" :style="{ transform: `translateX(${-currentIndex * 100}%)` }">
                <div v-for="(table, index) in parentTables" :key="table.id" class="parent-table"
                    :class="{ 'project-ended': table.projectInfo.status == 'PLACE_ON_FILE' }" ref="ref_parentTables">
                    <!-- 面板 -->
                    <div class="custom-panel" v-if="table.transmitted == false">
                        <div class="panel-content">
                            <!-- 左侧项目名称 -->
                            <div class="project-name">
                                <el-icon>
                                    <Folder />
                                </el-icon>
                                <span>{{ table.id }}、{{ table.projectInfo.projectName }}</span>
                            </div>


                            <!-- 右侧功能区 -->
                            <div class="action-area">
                                <el-button type="text" class="transfer-btn" @click="openDeliverForm(table)">
                                    项目转交
                                </el-button>

                                <div class="task-control">
                                    <el-select v-model="currentAction" placeholder="选择操作"
                                        @change="handleActionChange(index)">
                                        <el-option label="下一步" value="complete"
                                            :disabled="table.paused || !table.saved"></el-option>
                                        <el-option :label="table.paused ? '项目启动' : '项目暂停'"
                                            :value="table.paused ? 'resume' : 'pause'"
                                            :disabled="!table.saved"></el-option>
                                        <el-option label="项目结束" value="over"
                                            :disabled="table.paused || !table.saved"></el-option>
                                    </el-select>
                                </div>

                                <el-button type="text" class="save-btn" @click="saveProject(table)">
                                    保存
                                </el-button>
                            </div>
                        </div>
                    </div>


                    <div class="table-content" v-if="table.transmitted == false">
                        <!-- 任务流程部分 -->
                        <div class="task-section" :class="{ 'paused': table.paused }">

                            <div class="task-flow" ref="ref_task_flow">
                                <svg class="connectors" ref="connectors">

                                    <path v-for="(path, idx) in table.connectors" :key="idx" :d="path.d"
                                        :stroke="path.status == 'NOT_FINISHED' ? '#e0e0e0' : path.status == 'DOING' ? '#7c68ee' : '#4CAF50'"
                                        stroke-width="3" fill="none" />
                                </svg>

                                <div v-for="(task, i) in table.tasks" :key="i" class="task-node" :class="{
                                    'active': task.status === 'DOING',
                                    'completed': task.status === 'FINISHED',
                                    'paused': table.paused
                                }" ref="ref_taskNodes">

                                    <div class="task-circle" ref="ref_taskCircles">
                                        <span v-if="task.status === 'FINISHED'">✓</span>
                                        <span v-else>{{ i + 1 }}</span>
                                    </div>
                                    <div class="task-name">{{ task.content }}</div>
                                    <div class="task-time" v-if="task.status === 'FINISHED'">{{ task.finishTime }}</div>
                                    <div class="task-time" :class="{ active: task.status === 'DOING' }"
                                        v-else-if="task.status === 'DOING'">进行中...</div>
                                    <div class="task-time" v-else>{{ ' ' }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 输入区域部分 -->
                        <div class="input-section">
                            <div class="input-grid">
                                <div class="input-item">
                                    <label>单位名称：</label>
                                    <el-input v-model="table.projectInfo.unitName" size="small"
                                        placeholder="请输入单位名称"></el-input>
                                </div>
                                <div class="input-item">
                                    <label>类别：</label>
                                    <!-- <el-input v-model="table.projectInfo.type" size="small"
                                        placeholder="请输入类别"></el-input> -->
                                    <el-select v-model="table.projectInfo.unitType" size="medium" placeholder="请选择类别">
                                        <el-option v-for="item in projectTypes" :key="item.enumKey"
                                            :label="item.enumName" :value="item.enumKey">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="input-item">
                                    <label>牵头部门（需求科室）：</label>
                                    <el-input v-model="table.projectInfo.departName" size="medium"
                                        placeholder="请输入牵头部门"></el-input>
                                </div>
                                <div class="input-item">
                                    <label>项目负责人：</label>
                                    <el-input v-model="table.projectInfo.commander" size="medium"
                                        placeholder="请输入负责人"></el-input>
                                </div>
                                <div class="input-item">
                                    <label>项目名称：</label>
                                    <el-input v-model="table.projectInfo.projectName" size="medium"
                                        placeholder="请输入项目名称"></el-input>
                                </div>
                                <div class="input-item">
                                    <label>项目初步预算金额（万元）：</label>
                                    <el-input v-model="table.projectInfo.budgetMoney" size="medium" placeholder="请输入预算"
                                        type="number"></el-input>
                                </div>
                                <div class="input-item">
                                    <label>项目启动时间：</label>
                                    <el-date-picker v-model="table.projectInfo.startTime" type="date"
                                        placeholder="选择开始时间" value-format="YYYY-MM-DD" size="medium"></el-date-picker>
                                </div>
                            </div>
                        </div>
                        <!-- 子表格部分 -->
                        <div class="child-table-section">
                            <div class="app-container">
                                <div class="table-container">
                                    <div class="table-header">
                                        跟进记录
                                    </div>

                                    <el-table :data="table.followRecords" style="width: 100%"
                                        @row-click="openDetailDialog">
                                        <el-table-column prop="endTime" label="时间" width="310">
                                            <template #default="{ row }">
                                                <div class="time-range">
                                                    <i class="fas fa-clock"></i>
                                                    <span>{{ row.startTime }}~{{ row.endTime }}</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="record" label="记录">
                                            <template #default="{ row }">
                                                <div class="record-cell">{{ row.record }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="predictTarget" label="预期目标">
                                            <template #default="{ row }">
                                                <div class="record-cell">{{ row.predictTarget }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="nextPlan" label="下一步计划">
                                            <template #default="{ row }">
                                                <div class="record-cell">{{ row.nextPlan }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="协调" width="120">
                                            <template #default="{ row }">
                                                <el-button class="coordination-btn" @click="openCoordination(row)">
                                                    <i class="fas fa-users"></i> 进入协调
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>

                                    <div class="footer-panel">
                                        <el-button class="add-btn" @click="openAddForm" :disabled="!table.saved">
                                            <i class="fas fa-plus"></i> 新增
                                        </el-button>

                                        <el-pagination background layout="prev, pager, next" :total="table.total"
                                            :page-size="table.pageSize" :current-page="table.currentPage"
                                            @current-change="(page: any) => handlePageChange(page, index)">
                                        </el-pagination>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 变更记录表格 -->
                        <div class="change-record-section">
                            <div class="app-container">
                                <div class="table-container">
                                    <div class="table-header">
                                        变更记录
                                    </div>
                                    <el-table :data="table.changeRecords" style="width: 100%">
                                        <el-table-column prop="createTime" label="时间" width="230">
                                            <template #default="{ row }">
                                                <div class="time-range">
                                                    <i class="fas fa-clock"></i>
                                                    <span>{{ row.createTime }}</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="username" label="变更人">
                                            <template #default="{ row }">
                                                <div class="record-cell">{{ row.username }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="departName" label="变更部门">
                                            <template #default="{ row }">
                                                <div class="record-cell">{{ row.departName }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="description" label="变更动作">
                                            <template #default="{ row }">
                                                <div class="record-cell">{{ row.description }}</div>
                                            </template>
                                        </el-table-column>
                                    </el-table>

                                    <div class="footer-panel">
                                        <div></div>
                                        <el-pagination background layout="prev, pager, next" :total="table.changeTotal"
                                            :page-size="table.changePageSize" :current-page="table.changeCurrentPage"
                                            @current-change="(page: any) => changeRecordhandlePageChange(page, index)">
                                        </el-pagination>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 半透明灰色遮罩层 -->
                    <div v-if="table.projectInfo.status == 'PLACE_ON_FILE'" class="overlay"></div>
                </div>
            </div>
        </div>
        <!-- 协调管理对话框 -->
        <el-dialog v-model="coordinationDialogVisible" title="协调管理" width="1200px" height="800px">
            <!-- <div class="dialog-header">
                协调管理 - {{ currentRecord.record.substring(0, 20) }}...
            </div> -->

            <div style="padding: 20px;">
                <el-table :data="coordinationData" class="coordination-table" border
                    @selection-change="handleCoordinationSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="协调时间" width="230">
                        <template #default="{ row }">
                            <div class="time-range">
                                <el-date-picker v-model="row.startTime" type="datetime" placeholder="开始时间"
                                    value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm"
                                    :disabled-date="(date: Date) => row.endTime && date > new Date(row.endTime)"
                                    @change="validateCoordinationTime(row)">
                                </el-date-picker>
                                <span>~</span>
                                <el-date-picker v-model="row.endTime" type="datetime" placeholder="结束时间"
                                    value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm"
                                    :disabled-date="(date: Date) => row.startTime && date < new Date(row.startTime)"
                                    @change="validateCoordinationTime(row)">
                                </el-date-picker>
                            </div>
                            <div v-if="row.timeError" class="error-message">{{ row.timeError }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="depart" label="协调部门">
                        <template #default="{ row }">
                            <el-select v-model="row.depart" placeholder="请选择"
                                @change="(val: any) => handleDepartIDChange(val, row)">
                                <el-option v-for="item in departmentOptions" :key="item.departId"
                                    :label="item.departmentName" :value="item.departId">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="coUser" label="协调人员">
                        <template #default="{ row }">
                            <el-select v-model="row.coUser" placeholder="请选择">
                                <el-option v-for="item in personOptions" :key="item.coordinatorId"
                                    :label="item.coordinatorName" :value="item.coordinatorId">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="协调内容">
                        <template #default="{ row }">
                            <el-input v-model="row.content" type="textarea" rows="1"></el-input>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="coordination-actions">
                    <div class="action-buttons">
                        <el-button type="primary" @click="addCoordination">
                            <i class="fas fa-plus"></i> ＋添加
                        </el-button>
                        <el-button type="danger" @click="removeCoordination">
                            <i class="fas fa-trash"></i> 移除
                        </el-button>
                    </div>

                    <div class="dialog-buttons">
                        <el-button class="cancel-btn" @click="coordinationDialogVisible = false">
                            <i class="fas fa-times"></i> 取消
                        </el-button>
                        <el-button class="record-save-btn" @click="saveCoordination(currentIndex)">
                            <i class="fas fa-save"></i> 保存
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 新增跟进记录对话框 -->
        <el-dialog v-model="addDialogVisible" title="新增跟进记录" width="600px">
            <div class="form-container">
                <el-form :model="newRecord" label-width="0px" ref="addForm">
                    <label for="">开始时间</label>
                    <el-form-item prop="startTime" :rules="timeRules" style="width: 100%; margin-bottom: 10px;">
                        <el-date-picker v-model="newRecord.startTime" type="datetime" placeholder="选择开始时间"
                            value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm"
                            :disabled-date="(date: Date) => newRecord.endTime && date > new Date(newRecord.endTime)">
                        </el-date-picker>
                    </el-form-item>
                    <label for="">结束时间</label>
                    <el-form-item prop="endTime" :rules="timeRules" style="width: 100%; margin-bottom: 10px;">
                        <el-date-picker v-model="newRecord.endTime" type="datetime" placeholder="选择结束时间"
                            value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm"
                            :disabled-date="(date: Date) => newRecord.startTime && date < new Date(newRecord.startTime)">
                        </el-date-picker>
                    </el-form-item>
                    <label for="">记录内容</label>
                    <el-form-item prop="record" :rules="[{ required: true, message: '记录内容不能为空' }]"
                        style="width: 100%; margin-bottom: 10px;">
                        <el-input v-model="newRecord.record" type="textarea" :rows="3" placeholder="请输入记录内容">
                        </el-input>
                    </el-form-item>
                    <label for="">预期目标</label>
                    <el-form-item style="width: 100%; margin-bottom: 10px;">
                        <el-input v-model="newRecord.predictTarget" type="textarea" :rows="2" placeholder="请输入预期目标">
                        </el-input>
                    </el-form-item>
                    <label for="">下一步计划</label>
                    <el-form-item style="width: 100%; margin-bottom: 10px;">
                        <el-input v-model="newRecord.nextPlan" type="textarea" :rows="2" placeholder="请输入下一步计划">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div class="dialog-footer">
                <el-button class="cancel-btn" @click="addDialogVisible = false">
                    <i class="fas fa-times"></i> 取消
                </el-button>
                <el-button class="record-save-btn" @click="saveNewRecord(currentIndex)">
                    <i class="fas fa-save"></i> 保存
                </el-button>
            </div>
        </el-dialog>
        <!-- 跟进记录详情对话框 -->
        <el-dialog v-model="detailDialogVisible" title="跟进记录" width="600px">
            <div class="form-container">
                <el-form :model="currentRecordDetail" label-width="0px" ref="detailForm" :disabled="!isEditing">
                    <label for="">开始时间</label>
                    <el-form-item prop="startTime" :rules="timeRules" style="width: 100%; margin-bottom: 10px;">
                        <el-date-picker v-model="currentRecordDetail.startTime" type="datetime" placeholder="选择开始时间"
                            value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm"
                            :disabled-date="(date: Date) => currentRecordDetail.endTime && date > new Date(currentRecordDetail.endTime)">
                        </el-date-picker>
                    </el-form-item>
                    <label for="">结束时间</label>
                    <el-form-item prop="endTime" :rules="timeRules" style="width: 100%; margin-bottom: 10px;">
                        <el-date-picker v-model="currentRecordDetail.endTime" type="datetime" placeholder="选择结束时间"
                            value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm"
                            :disabled-date="(date: Date) => currentRecordDetail.startTime && date < new Date(currentRecordDetail.startTime)">
                        </el-date-picker>
                    </el-form-item>
                    <label for="">记录内容</label>
                    <el-form-item prop="record" :rules="[{ required: true, message: '记录内容不能为空' }]"
                        style="width: 100%; margin-bottom: 10px;">
                        <el-input v-model="currentRecordDetail.record" type="textarea" :rows="3" placeholder="请输入记录内容">
                        </el-input>
                    </el-form-item>
                    <label for="">预期目标</label>
                    <el-form-item style="width: 100%; margin-bottom: 10px;">
                        <el-input v-model="currentRecordDetail.predictTarget" type="textarea" :rows="2"
                            placeholder="请输入预期目标">
                        </el-input>
                    </el-form-item>
                    <label for="">下一步计划</label>
                    <el-form-item style="width: 100%; margin-bottom: 10px;">
                        <el-input v-model="currentRecordDetail.nextPlan" type="textarea" :rows="2"
                            placeholder="请输入下一步计划">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div class="dialog-footer">
                <template v-if="!isEditing">
                    <el-button class="cancel-btn" @click="detailDialogVisible = false">
                        <i class="fas fa-times"></i> 关闭
                    </el-button>
                    <el-button class="modify-btn" @click="enableEditing">
                        <i class="fas fa-edit"></i> 修改
                    </el-button>
                </template>
                <template v-else>
                    <el-button class="cancel-btn" @click="cancelEditing">
                        <i class="fas fa-times"></i> 取消修改
                    </el-button>
                    <el-button class="record-save-btn" @click="saveEditRecord">
                        <i class="fas fa-save"></i> 保存
                    </el-button>
                </template>
            </div>
        </el-dialog>
        <!-- 新增项目转交对话框 -->
        <el-dialog v-model="deliverDialogVisible" title="项目转交" width="500px">
            <!-- <div class="dialog-header">
                项目转交
            </div> -->

            <div class="form-container">
                <el-form :model="deliverRecord" label-width="0px" ref="deliverForm">
                    <label>项目名称：</label>
                    <el-form-item prop="projectName" style="width: 100%; margin-bottom: 10px;">
                        <el-input v-model="deliverRecord.projectName" type="text" :rows="3" placeholder="请输入项目名称"
                            :disabled="true">
                        </el-input>
                    </el-form-item>
                    <label>项目进度：</label>
                    <el-form-item prop="projectProgress" style="width: 100%; margin-bottom: 10px;">
                        <el-input v-model="deliverRecord.projectProgress" type="text" :rows="2" placeholder="请输入项目进度"
                            :disabled="true">
                        </el-input>
                    </el-form-item>
                    <label>转交同事：</label>
                    <el-form-item prop="userID" style="width: 100%; margin-bottom: 10px;">
                        <el-select v-model="deliverRecord.userID" :rows="2" placeholder="请选择转交同事">
                            <el-option v-for="item in personOptions" :key="item.id" :label="item.realName"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <label>转交日期：</label>
                    <el-form-item prop="transmitTime" :rules="timeRules" style="width: 100%; margin-bottom: 10px;">
                        <!-- <el-date-picker v-model="deliverRecord.transmitTime" type="date" placeholder="选择时间"
                            value-format="YYYY-MM-DD">
                        </el-date-picker> -->
                        <el-input v-model="deliverRecord.transmitTime" type="text" :rows="1" placeholder="请输入项目进度"
                            :disabled="true">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-footer">
                <el-button class="cancel-btn" @click="deliverDialogVisible = false">
                    <i class="fas fa-times"></i> 取消
                </el-button>
                <el-button class="record-save-btn" @click="saveDeliverRecord(currentIndex)">
                    <i class="fas fa-save"></i> 保存
                </el-button>
            </div>
        </el-dialog>
        <div class="pagination" v-if="parentTables.length > 0">
            <button v-for="page in parentTables.length" :key="page" class="pagination-button"
                :class="{ active: currentIndex === page - 1 }" @click="goToTable(page - 1)">
                {{ page }}
            </button>
        </div>
    </div>

</template>

<script setup lang="ts" name="List">

// import { addProjectCoordinate, deleteProjectCoordinate, getChangeList, getCoordinatorNameMenu, getDepartmentNameMenu, getProgressNext, getProjectCoordinate, getProjectDetail, getProjectId, getProjectProgressList, getProjectRecordList, getUsersByDepartID, insertOrUpdate, InsertRecord, projectTransmit, updateProjectStatus, updateRecord } from '@/api/website';
import { ElMessage, progressProps } from 'element-plus';
import { createApp, ref, reactive, onMounted, nextTick, computed, toRefs, defineProps, onUnmounted, watch, watchEffect } from 'vue'
// import { type ParentTable, type ParentTables, type Tasks, type FollowRecords, type ChangeRecords } from "@/plan_types";
// import { departListAllDeps, userListUsers } from '@/api/backstage';
// import { getUserInfo } from '@/api';
// import { getUnitTypes } from '@/api/website/my_office/Workspace';
import dayjs from 'dayjs';
// import { watch } from 'fs';
// 父表格数据
const parentTables: any = ref([]);

const currentIndex = ref(0);
// const parentTable: any = computed((parentTables, currentIndex) => parentTables[currentIndex])
const currentAction = ref();
const connectors: any = ref([]);
const ref_parentTables: any = ref([])
const ref_taskNodes: any = ref([])
const ref_taskCircles: any = ref([])
const ref_task_flow: any = ref([])
// const props = withDefaults(defineProps<{
//     projectType: string
// }>(), {})

const projectIDs: any = ref([])
const projectProgress: any = ref([])
const projectDetail: any = ref([])
const projectRecord: any = ref([])
const projectChangeList: any = ref([])
// const unitRes = await getUnitTypes();
let projectTypes: any = ref([])

// 创建父表格
function createParentTable(id: any, projectID: string) {
    return {
        id: id,
        projectID: projectID,
        paused: false,
        saved: true,
        isEnded: false,
        transmitted: false,
        tasks: [
            { content: '已拜访邀约体验', status: 'NOT_FINISHED', finishTime: '' },
            { content: '已到公司体验', status: 'NOT_FINISHED', finishTime: '' },
            { content: '已报方案', status: 'NOT_FINISHED', finishTime: '' },
            { content: '阳光推荐会确定方案', status: 'NOT_FINISHED', finishTime: '' },
            { content: '方案上会', status: 'NOT_FINISHED', finishTime: '' },
            { content: '客户各级审批', status: 'NOT_FINISHED', finishTime: '' },
            { content: '财政局财评立项通过会', status: 'NOT_FINISHED', finishTime: '' },
            { content: '采购需求确定', status: 'NOT_FINISHED', finishTime: '' },
            { content: '招标文件拟定', status: 'NOT_FINISHED', finishTime: '' },
            { content: '挂网招标', status: 'NOT_FINISHED', finishTime: '' },
            { content: '投标中标', status: 'NOT_FINISHED', finishTime: '' },
            { content: '合同签订', status: 'NOT_FINISHED', finishTime: '' },
            { content: '施工调试', status: 'NOT_FINISHED', finishTime: '' },
            { content: '供应商内部验收', status: 'NOT_FINISHED', finishTime: '' },
            { content: '培训', status: 'NOT_FINISHED', finishTime: '' },
            { content: '试运行', status: 'NOT_FINISHED', finishTime: '' },
            { content: '正式验收', status: 'NOT_FINISHED', finishTime: '' },
            { content: '开票付款', status: 'NOT_FINISHED', finishTime: '' },
            { content: '售后巡检', status: 'NOT_FINISHED', finishTime: '' },
            { content: '二次开发', status: 'NOT_FINISHED', finishTime: '' }
        ],
        connectors: [],
        projectInfo: {
            unitName: '',
            type: '',
            departName: '',
            commander: '',
            projectName: '',
            budgetMoney: '',
            startTime: '',
        },
        followRecords: [],
        total: 0,
        currentPage: 1,
        pageSize: 3,
        changeRecords: [
            {
                createTime: "",
                departName: "",
                description: "",
                id: 0,
                projectId: 0,
                username: ""
            }
        ],
        changeTotal: 0,
        changeCurrentPage: 1,
        changePageSize: 3
    };
}

function calculateConnectors(tableIndex: any) {
    const table = parentTables.value[tableIndex];
    const connectors = [];

    // 遍历所有任务节点（除了第一个）
    for (let i = 1; i < table.tasks.length; i++) {//0~19
        const currentTask = table.tasks[i];
        const nextTask = table.tasks[i - 1];

        // 获取父元素位置
        const fatherElement = ref_task_flow.value[tableIndex]
        // console.log('fatherElement!@#$%^&&*()++================================',fatherElement);

        // 获取相邻子元素圆圈
        const currentCircle = ref_taskCircles.value[tableIndex * table.tasks.length + i]
        const lastCircle = ref_taskCircles.value[tableIndex * table.tasks.length + i - 1]

        // console.log('currentNode,nextNode::::::::::::::::::::::', currentNode, nextNode);



        if (!currentCircle || !lastCircle) {
            console.log('currentNode 和 nextNode有一个不存在，跳过');

            continue;
        }

        // 获取节点位置
        // const currentRect = currentCircle.getBoundingClientRect();
        // const nextRect = nextCircle.getBoundingClientRect();

        const currentRect = currentCircle.getBoundingClientRect();
        const lastRect = lastCircle.getBoundingClientRect();
        const fatherRect = fatherElement.getBoundingClientRect();

        // 计算中心点
        // console.log('currentCircle.offsetLeft, fatherElement.offsetLeft, currentRect.width/2-=========',currentCircle.offsetLeft, fatherElement.offsetLeft, currentRect.width/2);

        const currentCenterX = currentRect.left - fatherRect.left + currentRect.width / 2
        const currentCenterY = currentRect.top - fatherRect.top + currentRect.height / 2


        const nextCenterX = lastRect.left - fatherRect.left + lastRect.width / 2
        const nextCenterY = lastRect.top - fatherRect.top + lastRect.height / 2

        // console.log('currentCenterX,currentCenterY,nextCenterX,nextCenterY=-=-=-=-=-=-=-=-=--=-===-=-=-', currentCenterX, currentCenterY, nextCenterX, nextCenterY);

        // console.log('currentCenterX,currentCenterY===============', currentCenterX, currentCenterY);
        // console.log('nextCenterX,nextCenterY========================', nextCenterX, nextCenterY);


        const relativeCurrentX = currentCenterX;
        const relativeCurrentY = currentCenterY;
        const relativeLastX = nextCenterX;
        const relativeLastY = nextCenterY;

        // console.log('relativeCurrentX,relativeCurrentY===============', relativeCurrentX, relativeCurrentY);
        // console.log('relativeNextX,relativeNextY========================', relativeNextX, relativeNextY);

        // 确定连接线类型
        const isSameRow = Math.abs(relativeCurrentY - relativeLastY) < 50;

        let path = '';

        if (isSameRow) {
            // 同行 - 直线
            // console.log('${relativeCurrentY}-${relativeNextY}==============0');

            path = `M ${relativeLastX} ${relativeLastY} L ${relativeCurrentX} ${relativeCurrentY}`;
        } else {
            // 跨行 - 曲线
            // console.log('${relativeCurrentY}-${relativeNextY}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>0');
            const midX = (relativeCurrentX + relativeLastX) / 2;
            // console.log('midX--------------------------=================', midX);

            path = `M ${relativeLastX} ${relativeLastY} C ${midX} ${relativeCurrentY}, ${midX} ${relativeLastY}, ${relativeCurrentX} ${relativeCurrentY}`;
        }

        // 确定连接线状态
        connectors.push({
            d: path,
            status: currentTask.status
        });
        // connectors.forEach((item,index)=>{
        //     console.log('connectors',index,'connectors====================================', item);
        // })


    }

    return connectors;
}

// 更新所有连接线
function updateAllConnectors() {
    nextTick(() => {
        // console.log('!!!!!!!!!!!!!!!!!!!!!!!In updateAllConnectors updateAllConnectors updateAllConnectors updateAllConnectors!!!!!!!!');
        // console.log(ref_parentTables.value);
        // console.log(ref_taskNodes.value);

        connectors.value = document.querySelector('.connectors');

        if (!connectors.value) return;

        parentTables.value.forEach((table: any, index: any) => {
            table.connectors = calculateConnectors(index);
            // console.log('table.connectors====================##############', table.connectors);


        });

    });
}

// 处理操作选择
function handleActionChange(tableIndex: any) {
    console.log('处理操作变化了');
    console.log('tableIndex<<<<<<<', tableIndex);

    const table = parentTables.value[tableIndex];

    if (currentAction.value === 'complete') {
        console.log('点击了"下一步"');
        currentAction.value = null;
        console.log(table);

        const currentTaskIndex = table.tasks.findIndex((task: any) => task.status === 'DOING');
        console.log('table.projectID:::::', table.projectID);

        console.log(table.tasks[currentTaskIndex].id);
        console.log(table.tasks[currentTaskIndex].content);
        console.log(table.tasks[currentTaskIndex].progressDetailId);
        console.log(table.projectID);

        console.log(currentTaskIndex >= table.tasks.length - 1 ? null : table.tasks[currentTaskIndex + 1].id);
        console.log(currentTaskIndex >= table.tasks.length - 1 ? null : table.tasks[currentTaskIndex + 1].content);
        console.log(currentTaskIndex >= table.tasks.length - 1 ? null : table.tasks[currentTaskIndex + 1].progressDetailId);
        console.log(table.projectID);

        let currentProgress = {
            "id": table.tasks[currentTaskIndex].id,
            "progressContent": table.tasks[currentTaskIndex].content,
            "progressDetailId": table.tasks[currentTaskIndex].progressDetailId,
            "projectId": table.projectID
        }
        let nextProgress = {
            "id": currentTaskIndex >= table.tasks.length - 1 ? null : table.tasks[currentTaskIndex + 1].id,
            "progressContent": currentTaskIndex >= table.tasks.length - 1 ? null : table.tasks[currentTaskIndex + 1].content,
            "progressDetailId": currentTaskIndex >= table.tasks.length - 1 ? null : table.tasks[currentTaskIndex + 1].progressDetailId,
            "projectId": table.projectID

        }
        let DTO = {
            currentProgressDTO: currentProgress,
            nextProgressDTO: nextProgress,
        }
        console.log('DTO', DTO);

        getProgressNext(DTO).then((res: any) => {
            if (res.code == 200) {
                console.log('成功调用getProgressNext接口');
                console.log('res.data==', res.data);
                // completeCurrentTask(tableIndex);
                refreshProgress(table.projectID, props.projectType)
                refreshChangeRecord(table.changeCurrentPage, table.changePageSize, 'create_time desc', table.projectID)
            }
            else {
                // console.log(res.msg);
                ElMessage.warning(res.msg)
            }
        })

    } else if (currentAction.value === 'pause') {
        currentAction.value = null;
        const dto = {
            "projectId": parentTables.value[tableIndex].projectID,
            "projectStatus": "PAUSE",
            "projectStatusMsg": "项目暂停"
        }
        updateProjectStatus(dto).then((res: any) => {
            if (res.code == 200) {
                ElMessage.success('项目暂停请求成功')
                table.paused = true;
                table.projectInfo.status = 'PAUSE'

                updateAllConnectors();
                refreshChangeRecord(table.changeCurrentPage, table.changePageSize, 'create_time desc', table.projectID)
            } else {
                ElMessage.warning(res.msg)
            }
        })

    } else if (currentAction.value === 'resume') {
        currentAction.value = null;
        const dto = {
            "projectId": parentTables.value[tableIndex].projectID,
            "projectStatus": "NORMAL",
            "projectStatusMsg": "项目开始"
        }
        updateProjectStatus(dto).then((res: any) => {
            if (res.code == 200) {
                ElMessage.success('项目开始请求成功')
                table.paused = false;
                table.projectInfo.status = 'NORMAL'

                updateAllConnectors();
                refreshChangeRecord(table.changeCurrentPage, table.changePageSize, 'create_time desc', table.projectID)
            } else {
                ElMessage.warning(res.msg)
            }
        })

    } else if (currentAction.value === 'over') {
        currentAction.value = null;
        const dto = {
            "projectId": parentTables.value[tableIndex].projectID,
            "projectStatus": "PLACE_ON_FILE",
            "projectStatusMsg": "项目归档"
        }
        updateProjectStatus(dto).then((res: any) => {
            if (res.code == 200) {
                ElMessage.success('项目归档请求成功，项目已冻结')
                table.isEnded = true;
                table.projectInfo.status = 'PLACE_ON_FILE'

                updateAllConnectors();
                refreshChangeRecord(table.changeCurrentPage, table.changePageSize, 'create_time desc', table.projectID)
            } else {
                ElMessage.warning(res.msg)
            }
        })
    }
}

// function name(params:type) {

// }

// 完成当前任务
function completeCurrentTask(tableIndex: any) {
    const table = parentTables.value[tableIndex];
    // 找到当前进行中的任务
    const currentTaskIndex = table.tasks.findIndex((task: any) => task.status === 'DOING');

    if (currentTaskIndex >= 0) {
        // 更新任务状态
        table.tasks[currentTaskIndex].status = 'FINISHED';
        table.tasks[currentTaskIndex].finishTime = new Date().toLocaleDateString();

        // 激活下一个任务
        if (currentTaskIndex < table.tasks.length - 1) {
            table.tasks[currentTaskIndex + 1].status = 'DOING';
        }
    }
    //初始情况
    else {
        table.tasks[0].status = 'DOING';
    }

    // 重置下拉菜单
    currentAction.value = null;
    updateAllConnectors();
}

// 子表格相关
// 分页相关
// const currentPage = ref(1);
// const pageSize = ref(3);

// 计算分页数据
function sortByDate(a: any, b: any) {
    if (a != b) {
        if (a > b) return 1
        else return -1
    }
    else {
        return new Date(a.endTimestamp).getTime() - new Date(b.endTimestamp).getTime()
    }
}
const paginatedRecords = computed(() => {
    let Records = []
    for (let i = 0; i < parentTables.value.length; i++) {
        const start = (parentTables.value[i].currentPage - 1) * parentTables.value[i].pageSize;
        const end = start + parentTables.value[i].pageSize;
        Records.push(parentTables.value[i].followRecords.slice(start, end))
    }
    return Records
})
// 当前操作的记录
const currentRecord: any = ref({});

// 协调管理对话框可见性
const coordinationDialogVisible = ref(false);

// 协调数据表
const coordinationData: any = ref([]);

// 人员选项
const personOptions: any = ref([]);

// 部门选项
const departmentOptions: any = ref([]);

// 新增记录对话框可见性
const addDialogVisible = ref(false);

// 新记录表单数据
interface newRecordType {
    [key: string]: string
}

// 时间验证规则
const timeRules = [
    { required: true, message: '请选择时间', trigger: 'change' },
    { validator: validateTime, trigger: 'change' }
];

// 时间验证函数
function validateTime(rule: any, value: any, callback: any) {
    if (!newRecord.startTime || !newRecord.endTime) {
        callback();
        return;
    }

    const start = new Date(newRecord.startTime).getTime();
    const end = new Date(newRecord.endTime).getTime();

    if (start > end) {
        callback(new Error('开始时间不能晚于结束时间'));
    } else {
        callback();
    }
}

// 打开协调管理对话框
const openCoordination = (record: any) => {
    personOptions.value.length = 0
    departmentOptions.value.length = 0
    coordinationData.value.length = 0
    currentRecord.value = record;
    console.log('打开了协调管理对话框,当前row为：：：：', record);
    getProjectCoordinate(record.id).then((res: any) => {
        if (res.code == 200) {
            console.log('成功请求协调数据');
            console.log('数据为：：：：：：：', res.data);

            coordinationData.value = [...res.data]
            coordinationDialogVisible.value = true;

            getDepartmentNameMenu().then((res: any) => {
                if (res.code == 200) {
                    // ElMessage.warning('成功查询所有部门信息。。')
                    departmentOptions.value = [...res.data]
                    console.log('departmentOptions...', departmentOptions.value);
                }
                else {
                    ElMessage.warning(res.msg)
                }
            })
        }
    })
};

function handleDepartIDChange(val: any, row: any) {
    let departID = val
    ElMessage.warning(departID)
    getCoordinatorNameMenu(departID).then((res: any) => {
        if (res.code == 200) {
            // ElMessage.warning('成功根据部门获取所有员工信息》》》')
            personOptions.value = [...res.data]
            console.log('personOptions.value...', personOptions.value);

        } else {
            ElMessage.warning(res.msg)
        }
    })
}

//验证协调时间
const validateCoordinationTime = (row: any) => {
    if (!row.startTime || !row.endTime) {
        row.timeError = '';
        return;
    }

    const start = new Date(row.startTime).getTime();
    const end = new Date(row.endTime).getTime();

    if (start > end) {
        row.timeError = '开始时间不能晚于结束时间';
    } else {
        row.timeError = '';
        row.time = `${row.startTime}~${row.endTime}`;
        row.startTimestamp = row.startTime;
    }
};


// 添加协调记录
const addCoordination = () => {
    coordinationData.value.unshift({
        "coUser": "",
        "content": "",
        "depart": "",
        "endTime": "",
        "projectId": 0,
        "recordId": 0,
        "startTime": ""
    });
};

// 移除协调记录
// 存储选中的协调记录
const selectedCoordinations = ref<any[]>([]);

// 处理协调记录选择变化
const handleCoordinationSelectionChange = (selection: any[]) => {
    selectedCoordinations.value = selection;
};

// 移除选中的协调记录
const removeCoordination = () => {
    console.log('点击了删除选中的协调记录');
    console.log('selectedCoordinations.value', selectedCoordinations.value);

    if (selectedCoordinations.value.length === 0) {
        ElMessage.warning('请选择要移除的协调记录');
        return;
    }

    // 获取选中记录的_tempId
    const selectedIds = selectedCoordinations.value.map(item => item.id);
    console.log('selectedIds', selectedIds);


    // 过滤掉选中的记录
    deleteProjectCoordinate({ id: null, ids: selectedIds }).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success('请求删除协调数据成功。')

            selectedCoordinations.value.length = 0
            coordinationDialogVisible.value = false;
        } else {
            ElMessage.warning(res.msg)
        }
    })
};
// 保存协调记录
const saveCoordination = (index: any) => {
    console.log('点击了保存协调数据，当前协调数据为');
    console.log(coordinationData.value);

    let coordinationDTO = {
        "coUserId": coordinationData.value[0].coUser,
        "content": coordinationData.value[0].content,
        "departId": coordinationData.value[0].depart,
        "endTime": coordinationData.value[0].endTime,
        "projectId": currentRecord.value.projectId,
        "recordId": currentRecord.value.id,
        "startTime": coordinationData.value[0].startTime,
        "userId": JSON.parse(localStorage.getItem('user')).id
    }
    console.log('coordinationDTO::::', coordinationDTO);


    addProjectCoordinate(coordinationDTO).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success('添加成功')
            coordinationDialogVisible.value = false;
        } else {
            ElMessage.warning(res.msg)
        }
    })

};

// 打开新增记录对话框
const openAddForm = () => {
    // 重置表单
    Object.keys(newRecord).forEach((key) => {
        newRecord[key] = '';
    });
    addDialogVisible.value = true;
};

//记录暂存
const newRecord: any = reactive({
    startTime: '',
    endTime: '',
    record: '',
    predictTarget: '',
    nextPlan: ''
});

// 保存新记录
const saveNewRecord = (index: any) => {
    console.log('在新增记录中点击了“保存”');
    console.log('currentIndex======================', index);

    if (!newRecord.startTime || !newRecord.endTime || !newRecord.record) {
        ElMessage.warning('请填写必填字段（时间、记录内容）');
        return;
    }

    // 重置当前页到第一页
    parentTables.value[index].currentPage = 1;

    const newRecordDTO = {
        id: null,
        startTime: newRecord.startTime,
        endTime: newRecord.endTime,
        record: newRecord.record,
        predictTarget: newRecord.predictTarget || '暂无',
        projectId: parentTables.value[index].projectID,
        nextPlan: newRecord.nextPlan || '暂无',
        // coordination: []
    };
    console.log('newRecordDTO', newRecordDTO);

    InsertRecord(newRecordDTO).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success('新增记录成功。')
            refreshRecord(parentTables.value[index].currentPage, parentTables.value[index].pageSize, 'create_time desc', parentTables.value[index].projectID)
            refreshChangeRecord(parentTables.value[index].changeCurrentPage, parentTables.value[index].changePageSize, 'create_time desc', parentTables.value[index].projectID)
            addDialogVisible.value = false;
        } else {
            ElMessage.warning(res.msg)
        }
    })


    // console.log('添加成功》》》parentTables.value[index]',parentTables.value[index]);
};

// 分页变化处理
const handlePageChange = (page: any, index: any) => {
    parentTables.value[index].currentPage = page;
    refreshRecord(parentTables.value[index].currentPage, parentTables.value[index].pageSize, 'create_time desc', parentTables.value[index].projectID)
};

//修改跟进记录部分

// 跟进记录详情对话框可见性
const detailDialogVisible = ref(false);
// 当前选中的跟进记录详情
const currentRecordDetail: any = ref({});
// 是否处于编辑状态
const isEditing = ref(false);
// 原始记录数据（用于取消修改时恢复）
const originalRecord: any = ref({});

// 打开详情对话框
const openDetailDialog = (record: any) => {
    setTimeout(() => {
        if (coordinationDialogVisible.value == false) {
            // 复制记录数据
            currentRecordDetail.value = { ...record };
            // 保存原始数据
            originalRecord.value = { ...record };
            // 初始为非编辑状态
            isEditing.value = false;
            // 打开对话框
            detailDialogVisible.value = true;
        }
    }, 100);
};

// 启用编辑模式
const enableEditing = () => {
    isEditing.value = true;
};

// 取消编辑
const cancelEditing = () => {
    // 恢复原始数据
    currentRecordDetail.value = { ...originalRecord.value };
    isEditing.value = false;
};

// 保存编辑后的记录
const saveEditRecord = () => {
    // 验证表单
    // 这里可以添加表单验证逻辑

    // 准备更新数据
    const updateData = {
        id: currentRecordDetail.value.id,
        endTime: currentRecordDetail.value.endTime,
        nextPlan: currentRecordDetail.value.nextPlan,
        predictTarget: currentRecordDetail.value.predictTarget,
        projectId: currentRecordDetail.value.projectId,
        record: currentRecordDetail.value.record,
        startTime: currentRecordDetail.value.startTime
    };

    // 调用更新接口
    updateRecord(updateData).then((res: any) => {
        if (res.code === 200) {

            // 刷新数据
            const index = parentTables.value.findIndex((table: any) =>
                table.projectID === updateData.projectId
            );

            if (index !== -1) {
                ElMessage.success('更新成功');
                refreshRecord(parentTables.value[index].currentPage, parentTables.value[index].pageSize, 'create_time desc', updateData.projectId);
                refreshChangeRecord(parentTables.value[index].changeCurrentPage, parentTables.value[index].changePageSize, 'create_time desc', updateData.projectId)
            }

            // 关闭对话框
            detailDialogVisible.value = false;
        } else {
            ElMessage.error(res.msg || '更新失败');
        }
    });
};

// 变更记录表格部分
const changeRecordCurrentPage = ref(1);
const changeRecordPageSize = ref(3);

function sortChangeRecordByDate(a: any, b: any) {

    if (a >= b) return 1
    else return -1
}

const changeRecordBatch = computed(() => {
    const start = (changeRecordCurrentPage.value - 1) * changeRecordPageSize.value;
    const end = start + changeRecordPageSize.value;
    return [...changesRecords.value]
        .sort(sortChangeRecordByDate)
        .slice(start, end);
});

const changesRecords = ref([
    {
        time: '2023-10-15 09:00',
        // startTimestamp: '2023-10-15 09:00',
        // endTimestamp: '2023-10-15 11:30',
        changeMan: '与客户进行需求分析会议，明确了项目的主要功能点和设计要求。客户对初步设计方案表示满意，提出了一些改进建议。',
        changeDepartment: '完成需求规格说明书初稿',
        changeAction: '根据客户反馈修改设计方案，准备下一轮评审',
    },
    {
        time: '2023-10-15 09:00',
        // startTimestamp: '2023-10-15 09:00',
        // endTimestamp: '2023-10-15 11:30',
        changeMan: '与客户进行需求分析会议，明确了项目的主要功能点和设计要求。客户对初步设计方案表示满意，提出了一些改进建议。',
        changeDepartment: '完成需求规格说明书初稿',
        changeAction: '根据客户反馈修改设计方案，准备下一轮评审',
    },
    {
        time: '2023-10-15 09:00',
        // startTimestamp: '2023-10-15 09:00',
        // endTimestamp: '2023-10-15 11:30',
        changeMan: '与客户进行需求分析会议，明确了项目的主要功能点和设计要求。客户对初步设计方案表示满意，提出了一些改进建议。',
        changeDepartment: '完成需求规格说明书初稿',
        changeAction: '根据客户反馈修改设计方案，准备下一轮评审',
    }
]);
// 分页变化处理
const changeRecordhandlePageChange = (page: any, index: any) => {

    changeRecordCurrentPage.value = page;
    parentTables.value[index].changeCurrentPage = page;
    refreshChangeRecord(
        parentTables.value[index].changeCurrentPage,
        parentTables.value[index].changePageSize,
        'create_time desc',
        parentTables.value[index].projectID
    )
};

//添加项目转交信息
const deliverDialogVisible = ref(false)
// 新记录表单数据
interface deliverRecordType {
    [key: string]: string
}
const deliverRecord: deliverRecordType = reactive({
    projectName: '',
    projectProgress: '',
    userName: '',
    userID: '',
    transmitTime: '',
});

//打开项目转交对话框
function openDeliverForm(table: any) {
    personOptions.value.length = 0
    departmentOptions.value.length = 0

    const now = dayjs()

    let doingIndex = table.tasks.findIndex((task: any) => task.status == 'DOING')
    // 重置表单
    deliverRecord.projectName = table.projectInfo.projectName
    deliverRecord.projectProgress = table.tasks[doingIndex].content
    deliverRecord.userName = ''
    deliverRecord.userID = ''
    deliverRecord.transmitTime = now.format('YYYY-MM-DD HH:mm')
    departListAllDeps().then((res: any) => {
        if (res.code == 200) {
            // ElMessage.warning('成功查询所有部门')
            deliverDialogVisible.value = true
            const saleIndex = res.data.findIndex((dep: any) => dep.title == '销售部')
            const saleDepID = res.data[saleIndex].id

            getUsersByDepartID(1, 9999, saleDepID).then((res: any) => {
                if (res.code == 200) {
                    // ElMessage.warning('成功查询销售部用户信息')
                    personOptions.value = [...res.data.list]
                } else {
                    ElMessage.warning(res.msg)
                }
            })
        } else {
            ElMessage.warning(res.msg)
        }
    })
}

//保存项目转交数据
function saveDeliverRecord(index: any) {
    const preParentTablesLength = parentTables.value.length
    let currentProjectID = parentTables.value[index].projectID
    // let userID = JSON.parse(localStorage.getItem('user')).id
    // console.log('currentProjectID:', currentProjectID, 'transmitTime==', deliverRecord.transmitTime, new Date(deliverRecord.transmitTime), 'userID==', userID, 'userName==', deliverRecord.userName);
    const dto = {
        "projectId": currentProjectID,
        "transmitTime": deliverRecord.transmitTime,
        "userId": deliverRecord.userID,
        "userName": personOptions.value[personOptions.value.findIndex((item: any) => item.id == deliverRecord.userID)].realName
    }
    console.log('点击了保存转交数据，请求参数为');
    console.log(dto);


    projectTransmit(dto).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success('转交成功！')
            // getChangeRecord(
            //     parentTables.value[currentIndex].changeCurrentPage,
            //     parentTables.value[currentIndex].changePageSize,
            //     'create_time desc',
            //     currentProjectID
            // )
            parentTables.value.splice(index, 1)
            if (parentTables.value.length > 0) {
                if (index == preParentTablesLength - 1) {
                    goToTable(index - 1)

                    console.log(`项目切换跳转到下标${index - 1}`);
                    console.log('当前currentindex为', currentIndex.value);


                } else {
                    goToTable(index)

                    console.log(`项目切换跳转到下标${index}`);
                    console.log('当前currentindex为', currentIndex.value);
                }
            }

            deliverDialogVisible.value = false
        } else {
            ElMessage.warning(res.msg)
        }
    })
}

//数组找不同
function findDifference(arr1: any, arr2: any) {
    const diff1 = arr1.filter((x: any) => !arr2.includes(x));
    const diff2 = arr2.filter((x: any) => !arr1.includes(x));
    return [...new Set([...diff1, ...diff2])];
}

//保存项目
function saveProject(table: any) {
    console.log('点击了保存项目。。。');

    if (!table.saved) {
        console.log(table.tasks, table.projectInfo);

        const firstTaskIndex = table.tasks.findIndex((item: any) => item.number == 1)
        // console.log('table.tasks[firstTaskIndex]:::::', table.tasks[firstTaskIndex]);
        table.tasks[firstTaskIndex].id = null

        // table.projectInfo.type = props.projectType
        const dto = {
            projectDTO: table.projectInfo,
            progressDTO: table.tasks[firstTaskIndex]
        }
        console.log('dto>>>>>>>>>', dto);

        insertOrUpdate(dto).then((res: any) => {
            if (res.code == 200) {
                ElMessage.success('保存成功')
                table.saved = true

                getProjectId(props.projectType).then((res: any) => {
                    if (res.code == 200) {
                        console.log('旧的项目id数组为', projectIDs.value);
                        console.log('新的项目id数组为', res.data);
                        console.log('两者的不同数据为：：：', findDifference(projectIDs.value, res.data));
                        const newProjectID = findDifference(projectIDs.value, res.data)
                        projectIDs.value.push(newProjectID[0])
                        projectIDs.value.sort()

                        table.projectID = newProjectID[0]
                        refreshProgress(table.projectID, props.projectType)
                        refreshDetail(table.projectID)
                        refreshChangeRecord(table.changeCurrentPage, table.changePageSize, 'create_time desc', table.projectID)

                    } else {
                        ElMessage.warning(res.msg)
                    }
                })

            } else {
                ElMessage.warning(res.msg)
            }
        })
    } else {
        const dto = {
            projectDTO: table.projectInfo,
            progressDTO: {}
        }
        console.log('dto>>>>>>>>>', dto);
        insertOrUpdate(dto).then((res: any) => {
            if (res.code == 200) {
                refreshDetail(table.projectID)
                refreshChangeRecord(table.changeCurrentPage, table.changePageSize, 'create_time desc', table.projectID)
                ElMessage.success('修改项目成功！')

            } else {
                ElMessage.warning(res.msg)
            }
        })
    }

}

// 添加父表格
function addParentTable() {

    getProjectProgressList(null, props.projectType).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success('成功新建项目')
            const newId = parentTables.value.length + 1;
            const newTable = createParentTable(newId, '');
            newTable.saved = false
            newTable.tasks = [...res.data]
            parentTables.value.push(newTable);

            // 切换到新添加的表格
            currentIndex.value = parentTables.value.length - 1;
            console.log('返回的项目进度为', res.data);
            updateAllConnectors()

        } else {
            ElMessage(res.msg)
        }
    })
    // updateAllConnectors();

}

// 导航到指定表格
function goToTable(index: any) {
    currentIndex.value = index;
}

// 上一个表格
function prevTable() {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    } else {
        currentIndex.value = parentTables.value.length - 1;
    }
}

// 下一个表格
function nextTable() {
    if (currentIndex.value < parentTables.value.length - 1) {
        currentIndex.value++;
    } else {
        currentIndex.value = 0;
    }
}

//获取项目所有数据
function refreshProjectAllData(projectType: string) {
    // ...清空数据
    projectIDs.value.length = 0
    projectProgress.value.length = 0
    projectDetail.value.length = 0
    projectRecord.value.length = 0
    projectChangeList.value.length = 0
    getProjectId(projectType).then((res: any) => {
        if (res.code == 200) {
            res.data.sort((a: any, b: any) => a - b)
            projectIDs.value = res.data;

            projectIDs.value.forEach((element: any, index: any) => {
                let table = createParentTable(index + 1, element)
                parentTables.value.push(table)
                const tableindex = parentTables.value.findIndex((table: any) => table.projectID == element)
                refreshProgress(element, projectType);
                refreshDetail(element);
                refreshRecord(parentTables.value[tableindex].currentPage, parentTables.value[tableindex].pageSize, 'create_time desc', parentTables.value[tableindex].projectID)
                refreshChangeRecord(parentTables.value[tableindex].changeCurrentPage, parentTables.value[tableindex].changePageSize, 'create_time desc', parentTables.value[tableindex].projectID)
            });
        }
    });
}

//获取项目进度
function refreshProgress(projectID: string, projectType: string) {
    getProjectProgressList(projectID, projectType).then((res: any) => {
        if (res.code == 200) {
            const processedResData = res.data.map((element: any) => {
                if (element.finishTime == null) {
                    console.log('finish time为空');

                    return element
                } else {
                    console.log('finish time为', element.finishTime);
                    return { ...element, finishTime: element.finishTime.slice(0, 16) }
                }
            })
            console.log('processedResDate', processedResData);

            const index = parentTables.value.findIndex((table: any) => table.projectID == projectID)
            parentTables.value[index].tasks = [...processedResData]
            projectProgress.value.push(processedResData)
            updateAllConnectors()
            // ElMessage.success('成功刷新项目进度')
        } else {
            ElMessage.warning('请求项目进度失败' + res.msg)
        }
    })
}

//获取项目详情
function refreshDetail(projectID: string) {
    getProjectDetail(projectID).then((res: any) => {
        if (res.code == 200) {
            const index = parentTables.value.findIndex((table: any) => table.projectID == projectID)
            parentTables.value[index].projectInfo = res.data
            projectDetail.value.push(res.data)
            // ElMessage.success('成功刷新项目详情')
        }
        else ElMessage.warning(res.msg)
    })
}

//获取项目记录
function refreshRecord(pageNum: any, pageSize: any, orderBy: any, projectID: any) {

    getProjectRecordList(pageNum, pageSize, orderBy, projectID).then((res: any) => {
        if (res.code == 200) {
            // console.log('getRecord成功》》》》');
            // console.log(parentTables.value);

            let total = res.data.total
            let record = res.data.list
            console.log('返回的record--------------------', record);
            record = record.map((element: any) => {
                if (element.startTime == null && element.endTime == null) {
                    // console.log('finish time为空');
                    return element
                } else {
                    // console.log('finish time为',element.finishTime);
                    return { ...element, startTime: element.startTime.slice(0, 16), endTime: element.endTime.slice(0, 16) }
                }
            })

            let pageNum = res.data.pageNum
            let pageSize = res.data.pageSize
            // console.log(total, record, pageNum, pageSize);

            let index = parentTables.value.findIndex((element: any) => {
                return element.projectID == projectID
            })

            parentTables.value[index].total = Number(total)
            parentTables.value[index].followRecords = [...record]

        }
        else {
            ElMessage.warning(res.msg)
        }
    })
}

function refreshChangeRecord(pageNum: any, pageSize: any, orderBy: any, projectID: any) {

    getChangeList(pageNum, pageSize, orderBy, projectID).then((res: any) => {
        if (res.code == 200) {
            // console.log('getRecord成功》》》》');
            // console.log(parentTables.value);

            let total = res.data.total
            let record = res.data.list
            let pageNum = res.data.pageNum
            let pageSize = res.data.pageSize
            // console.log(total, record, pageNum, pageSize);

            let index = parentTables.value.findIndex((element: any) => {
                return element.projectID == projectID
            })

            parentTables.value[index].changeTotal = Number(total)
            parentTables.value[index].changeRecords = [...record]
        }
        else {
            ElMessage.warning(res.msg)
        }
    })
}


// 初始化连接线
onMounted(() => {
    let table = createParentTable(1, '123')
    parentTables.value.push(table)
    // refreshProjectAllData(props.projectType)
    // getUnitTypes().then((res: any) => {
    //     if (res.code == 200) {
    //         projectTypes.value = [...res.data]
    //     } else {
    //         ElMessage.warning(res.msg)
    //     }
    // })
    window.addEventListener('resize', updateAllConnectors);
});
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Helvetica Neue', Arial, sans-serif;
}

body {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 2000px;
    margin: 0 auto;
}

.header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
}

.header h1 {
    color: #2c3e50;
    font-size: 15px;
    margin-bottom: 10px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.header p {
    color: #7f8c8d;
    font-size: 15px;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
}

.project-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 25px;
}

.project-button {
    flex: 1;
    background-color: white;
    border: 1px solid #a247d6;
    border-radius: 6px;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 150px;
}

.project-button:hover {
    color: white;
    background-color: rgba(124, 104, 238, 0.8);
}

.actions {
    display: flex;
    justify-content: center;
    background: rgb(227, 232, 255);
    margin-bottom: 25px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px dotted #a247d6;
}

.add-table-btn {
    border: none;
    color: #640dd6;
    background-color: rgb(227, 232, 255);
    padding: 10px 50px;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.carousel-container {
    position: relative;
    overflow: hidden;
    margin-bottom: 30px;
    /* border-radius: 12px; */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    background: white;
    height: 1000px;
    width: 100%;
}

.carousel-track {
    display: flex;
    transition: transform 0.5s ease-in-out;
    height: 100%;
}

.parent-table {
    background: white;
    flex: 0 0 100%;
    height: 100%;
    overflow-y: auto;
    /* padding: 20px; */
    box-sizing: border-box;
}

.table-id {
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 20px;
    margin-right: 15px;
    font-weight: bold;
}

.section-title {
    color: #2c3e50;
    font-size: 15px;
    width: 30%;
    /* margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #3498db; */
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-title i {
    margin-right: 8px;
    color: #3498db;
}

.task-deliver {
    font-size: 15px;
    flex: 1;
    height: 100%;

}

.task-control {
    /* margin-bottom: 15px; */
    border: 1px solid black;
    box-shadow: 0 4px 12px rgba(122, 90, 245, 0.12);
    display: flex;
    flex: 1;
    justify-content: center;
}

.task-save {
    height: 100%;
    font-size: 15px;
    flex: 1;
}

.task-deliver button,
.task-save button {
    height: 100%;
    width: 100%;
}

/* 新面板 */
.custom-panel {
    background: linear-gradient(135deg, #f5f0ff, #e8deff);
    /* border: 3px solid #d9cfff; */
    border-width: 3px 3px 0px 3px;
    border-style: solid;
    border-color: #d9cfff;
    border-radius: 0;
    /* 无圆角 */
    padding: 0 20px;
    height: 56px;
    box-shadow: 0 2px 8px rgba(128, 0, 255, 0.08);
}

.panel-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    /* max-width: 1200px; */
    max-width: 100%;
    margin: 0;
}

.project-name {
    position: relative;
    left: 0;
    /* display: flex; */
    /* align-items: center; */
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #5a3d9c;
}

.action-area {
    display: flex;
    gap: 12px;
    align-items: center;
}

:deep(.el-button) {
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 0;
    /* 无圆角 */
    transition: all 0.2s;
}

.transfer-btn {
    width: 25%;
    color: black;
    border: 1px solid black;
    box-shadow: 0 4px 12px rgba(122, 90, 245, 0.12);

    &:hover {
        background: rgba(122, 90, 245, 0.08);
        color: #6a4ae0;
    }
}

.save-btn {
    width: 25%;
    color: black;
    border: 1px solid black;
    box-shadow: 0 4px 12px rgba(122, 90, 245, 0.12);

    &:hover {
        background: rgba(122, 90, 245, 0.08);
        color: #6a4ae0;
    }
}

.more-actions .el-button {
    color: #7a5af5;

    &:hover {
        background: rgba(122, 90, 245, 0.08);
        color: #6a4ae0;
    }
}

.dropdown-menu {
    border-radius: 0;
    /* 无圆角 */
    border: 1px solid #e0d6ff;
    box-shadow: 0 4px 12px rgba(122, 90, 245, 0.12);

    .el-dropdown-menu__item {
        padding: 8px 16px;
        font-size: 14px;
        color: #5a3d9c;

        &:hover {
            background-color: #f5f0ff;
            color: #7a5af5;
        }
    }
}

.table-content {
    display: flex;
    flex-direction: column;
    /* padding: 20px; */
}

.task-section {
    padding: 15px;
    /* border-bottom: 1px dashed #e0e0e0;  */
    /* border: 3px solid #d9cfff; */
    border-width: 3px 3px 0px 3px;
    border-style: solid;
    border-color: #d9cfff;
    border-radius: 0;
    position: relative;
    min-height: 400px;
}



/* 任务流程样式 */
.task-flow {
    display: grid;
    /* border: 1px bold #640dd6; */
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 20px 30px;
    position: relative;
    padding: 15px 0;
    height: 400px;
    z-index: 0;
}

.connectors {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.task-node {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* padding: 10px; */
}

.task-circle {
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background: white;
    border: 3px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #7f8c8d;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-size: 15px;
    z-index: 2;
}

.task-node.active .task-circle {
    background: #7c68ee;
    border-color: #7c68ee;
    color: white;
    transform: scale(1.1);
}

.task-node.completed .task-circle {
    background: #4CAF50;
    border-color: #4CAF50;
    color: white;
}

.task-node.paused .task-circle {
    background: #bdc3c7;
    border-color: #7f8c8d;
}

.task-name {
    font-size: 15px;
    text-align: center;
    color: #555;
    margin-bottom: 5px;
    font-weight: 500;
    line-height: 1.3;
    height: 36px;
    display: flex;
    align-items: center;
}

.task-time {
    font-size: 15px;
    color: #27ae60;
    text-align: center;
    height: 20px;
}

.task-time.active {
    font-size: 15px;
    color: white;
    text-align: center;
    padding: 0;
    background-color: #7C68EE;
    border-radius: 25px;
    height: 25%;
    width: 50%;
}

/* S型布局定位 */
.task-node:nth-child(1) {
    grid-column: 1;
    grid-row: 1;
}

.task-node:nth-child(2) {
    grid-column: 2;
    grid-row: 1;
}

.task-node:nth-child(3) {
    grid-column: 3;
    grid-row: 1;
}

.task-node:nth-child(4) {
    grid-column: 4;
    grid-row: 1;
}

.task-node:nth-child(5) {
    grid-column: 5;
    grid-row: 1;
}

.task-node:nth-child(6) {
    grid-column: 6;
    grid-row: 1;
}

.task-node:nth-child(7) {
    grid-column: 7;
    grid-row: 1;
}

.task-node:nth-child(8) {
    grid-column: 8;
    grid-row: 1;
}

.task-node:nth-child(9) {
    grid-column: 8;
    grid-row: 2;
}

.task-node:nth-child(10) {
    grid-column: 7;
    grid-row: 2;
}

.task-node:nth-child(11) {
    grid-column: 6;
    grid-row: 2;
}

.task-node:nth-child(12) {
    grid-column: 5;
    grid-row: 2;
}

.task-node:nth-child(13) {
    grid-column: 4;
    grid-row: 2;
}

.task-node:nth-child(14) {
    grid-column: 3;
    grid-row: 2;
}

.task-node:nth-child(15) {
    grid-column: 2;
    grid-row: 2;
}

.task-node:nth-child(16) {
    grid-column: 1;
    grid-row: 2;
}

.task-node:nth-child(17) {
    grid-column: 1;
    grid-row: 3;
}

.task-node:nth-child(18) {
    grid-column: 2;
    grid-row: 3;
}

.task-node:nth-child(19) {
    grid-column: 3;
    grid-row: 3;
}

.task-node:nth-child(20) {
    grid-column: 4;
    grid-row: 3;
}

.task-node:nth-child(21) {
    grid-column: 5;
    grid-row: 3;
}

.task-node:nth-child(22) {
    grid-column: 6;
    grid-row: 3;
}

.task-node:nth-child(23) {
    grid-column: 7;
    grid-row: 3;
}

.task-node:nth-child(24) {
    grid-column: 8;
    grid-row: 3;
}

/* 项目暂停状态 */
.paused .task-node .task-circle {
    background: #ecf0f1;
    border-color: #bdc3c7;
    color: #7f8c8d;
}

.paused .task-node.active .task-circle {
    background: #bdc3c7;
    border-color: #7f8c8d;
}

.paused .task-node.completed .task-circle {
    background: #95a5a6;
    border-color: #7f8c8d;
}

.paused .task-time {
    color: #7f8c8d;
}

.status-indicator {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 8px;
}

.status-active {
    background-color: #3498db;
}

.status-paused {
    background-color: #e74c3c;
}

.project-status {
    margin-left: 15px;
    font-size: 15px;
    padding: 4px 10px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.2);
}

.status-active-bg {
    background-color: rgba(52, 152, 219, 0.2);
}

.status-paused-bg {
    background-color: rgba(231, 76, 60, 0.2);
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
}

.pagination-button {
    width: 40px;
    height: 40px;
    /* border-radius: 50%; */
    border: 1px solid #7C68EE;
    background: white;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7C68EE;
}

.pagination-button.active {
    background: #7C68EE;

    color: white;
}

.pagination-button:hover:not(.active) {
    background: #a598ee;
    color: white;
}

.carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: #5a3d9c;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 15px;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s;
}

.carousel-nav:hover {
    background: #3498db;
    transform: translateY(-50%) scale(1.1);
}

.carousel-prev {
    left: 10%;
}

.carousel-next {
    right: 10%;
}

.input-section {
    padding: 15px;
    border-width: 3px 3px 0px 3px;
    border-style: solid;
    border-color: #d9cfff;
    border-radius: 0;
    min-height: 200px;
}

.input-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    height: 200px;
}

.input-item {
    display: flex;
    flex-direction: column;
}

.input-item label {
    font-size: 17px;
    color: #555;
    margin-bottom: 5px;
    font-weight: 500;
}

.empty-state {
    text-align: center;
    padding: 50px 0;
    color: #95a5a6;
}

.empty-state i {
    font-size: 15px;
    margin-bottom: 15px;
    color: #e0e0e0;
}

/* 子表格样式 */
.table-header {
    background-color: #f0f2ff;
    /* padding: 15px 20px; */
    border-bottom: 1px solid #e4e1ff;
    font-size: 20px;
    font-weight: 600;
    color: #5a3d9c;
    text-align: center;
    padding: 10px 0;
}

.child-table-section {
    height: 300px;
    /* padding: 20px 25px; */
    border-width: 3px 3px 0px 3px;
    border-style: solid;
    border-color: #d9cfff;
    border-radius: 0;
}

.app-container {
    /* max-width: 1400px; */
    width: 100%;
    /* padding: 20px; */
}

.table-container {
    background-color: white;
    /* border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
    overflow: hidden;
    margin-bottom: 30px;
}

.time-range {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #5a3d9c;
    font-size: 14px;
    /* width: 20%; */
}

.time-range i {
    color: #8a7df7;
}

.record-cell {
    max-height: 60px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.5;
}

.coordination-btn {
    background-color: #6a5af9;
    color: white !important;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    transition: all 0.3s;
}

.coordination-btn:hover {
    background-color: #5a4ae0;
}

.footer-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #f9f8ff;
    border-top: 1px solid #e4e1ff;
}

.add-btn {
    background-color: #6a5af9;
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.3s;
}

.add-btn:hover {
    background-color: #5a4ae0;
}

.record-save-btn {
    background-color: #6a5af9;
    color: white;
    border: none;
}

.dialog-header {
    background-color: #6a5af9;
    color: white;
    padding: 15px 20px;
    /* border-radius: 8px 8px 0 0; */
    font-size: 18px;
    font-weight: 600;
}

.coordination-table {
    margin-top: 15px;
}

.error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
}

.coordination-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 15px 0;
    border-top: 1px solid #eee;
}

.action-buttons {
    display: flex;
    gap: 12px;
}

.cancel-btn {
    background-color: #f0f2ff;
    color: #6a5af9;
    border: 1px solid #d9d6ff;
}

:deep(.el-dialog__header) {
    background: #d9cfff;
    color: white;
    padding: 15px 20px;
    margin: 0;
}

/* 变更记录表格 */
.change-record-section {
    height: 260px;
    /* padding: 20px 25px; */
    /* margin-top: 50px; */
    border-width: 3px;
    border-style: solid;
    border-color: #d9cfff;
    border-radius: 0;
}

/* 项目结束 */
.project-ended {
    position: relative;
}

.overlay {
    position: fixed;
    top: 0;
    /* left: 0; */
    width: 100%;
    height: 100%;
    background-color: rgba(128, 128, 128, 0.5);
    z-index: 999;
    pointer-events: all;
    /* 阻止所有点击事件 */
}

/*将所有元素变灰 */
/* .project-ended * {
    filter: grayscale(100%);
} */
</style>