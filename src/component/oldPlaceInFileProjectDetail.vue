<template>
    <div class="container">
        <div class="project-header">
            <a @click="router.back()" class="header-link">
                归档项目
            </a>
            <label for="" class="project-name-label"> > {{ props.workbenchDetailProjectName }}</label>
            <button class="recovery-link" @click="projectRecovery(props.workbenchDetailID, 'NORMAL', '项目恢复')"
                :disabled="!isOwner">
                项目恢复
            </button>
        </div>

        <div class="carousel-container">
            <div class="carousel-track" :style="{ transform: `translateX(${-currentIndex * 100}%)` }">
                <div v-for="(table, index) in parentTables" :key="table.id" class="parent-table" ref="ref_parentTables">
                    <!-- 面板 -->
                    <div class="custom-panel" v-if="table.transmitted == false">
                        <div class="panel-content">
                            <!-- 左侧项目名称 -->
                            <div class="project-name">
                                <el-icon>
                                    <Folder />
                                </el-icon>
                                <span>{{ table.id }}、{{
                                    table.projectInfo.projectName != "" ? table.projectInfo.projectName :
                                        table.projectInfo.coIntentionalProject
                                    }}</span>
                            </div>

                            <!-- 右侧功能区 -->
                            <div class="action-area">
                                <!-- <el-button type="text" class="transfer-btn" @click="openDeliverForm(table)"
                                    v-if="isOwner">
                                    项目转交
                                </el-button> -->
                                <!-- <div></div> -->

                                <!-- <div class="task-control">
                                    <el-select v-model="currentAction" placeholder="更多操作" :suffix-icon='SelectIcon'
                                        @change="handleActionChange(index)" :disabled="true">
                                        <el-option label="下一步" value="complete"
                                            :disabled="table.paused || !table.saved"></el-option>
                                        <el-option :label="table.paused ? '项目启动' : '项目暂停'"
                                            :value="table.paused ? 'resume' : 'pause'"
                                            :disabled="!table.saved"></el-option>
                                        <el-option label="项目结束" value="over"
                                            :disabled="table.paused || !table.saved"></el-option>
                                    </el-select>
                                </div> -->
                            </div>
                        </div>
                    </div>

                    <div class="table-content" v-if="table.transmitted == false">
                        <!-- 任务流程部分 -->
                        <div class="task-section" :class="{ paused: table.projectInfo.status == 'PAUSE' }">
                            <div class="task-flow" ref="ref_task_flow">
                                <div v-for="(task, i) in table.tasks" :key="i" class="task-node-container">
                                    <!-- 添加连接线 -->
                                    <div v-if="i > 0" class="connector-line" :class="{
                                        paused: table.projectInfo.status === 'PAUSE' && task.status !== 'FINISHED',
                                        completed: task.status === 'FINISHED',
                                        active: task.status === 'DOING',
                                    }"></div>

                                    <div class="task-node" :class="{
                                        active: task.status === 'DOING',
                                        completed: task.status === 'FINISHED',
                                        paused: table.projectInfo.status == 'PAUSE',
                                    }">
                                        <div class="task-circle">
                                            <span v-if="task.status === 'FINISHED'">✓</span>
                                            <span v-else>{{ i + 1 }}</span>
                                        </div>
                                        <div class="task-name">
                                            <div>{{ task.content }}</div>
                                            <div v-if="task.content=='方案上会'||task.content=='财政局财评、立项通过会'||task.content=='采购需求确定'" style="margin-left: 3px;"><img src="./icon/感叹号.png" alt=""></div>
                                        </div>
                                        <div class="task-time" v-if="task.status === 'FINISHED'">
                                            {{ task.finishTime }}
                                        </div>
                                        <div class="task-time" :class="{ active: task.status === 'DOING' }"
                                            v-else-if="task.status === 'DOING'">
                                            进行中...
                                        </div>
                                        <div class="task-time" v-else>{{ " " }}</div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <!-- 输入区域部分 -->
                        <EducationSystemADetail v-if="props.workbenchDetailType == 'EDUCATION_SYSTEM_A_CUSTOMER'"
                            :table="table" :projectTypes="projectTypes" :isOwner="false"
                            @saveProjectEvent="saveProject" />
                        <EducationSystemADetail v-if="props.workbenchDetailType == 'EDUCATION_SYSTEM_B_CUSTOMER'"
                            :table="table" :projectTypes="projectTypes" :isOwner="false"
                            @saveProjectEvent="saveProject" />
                        <EducationSystemADetail v-if="props.workbenchDetailType == 'MEDICAL_SYSTEM_A_CUSTOMER'"
                            :table="table" :projectTypes="projectTypes" :isOwner="false"
                            @saveProjectEvent="saveProject" />
                        <EducationSystemADetail v-if="props.workbenchDetailType == 'MEDICAL_SYSTEM_B_CUSTOMER'"
                            :table="table" :projectTypes="projectTypes" :isOwner="false"
                            @saveProjectEvent="saveProject" />
                        <EducationSystemADetail v-if="props.workbenchDetailType == 'ORGAN_INSTITUTION_PROJECT'"
                            :table="table" :projectTypes="projectTypes" :isOwner="false"
                            @saveProjectEvent="saveProject" />
                        <paymentCollectionDetail v-if="props.workbenchDetailType == 'PAYMENT_COLLECTION_PROJECT'"
                            :table="table" :projectTypes="projectTypes" :isOwner="false"
                            @saveProjectEvent="saveProject" />
                        <PartnerFollowUpDetail v-if="props.workbenchDetailType == 'PARTNER_FOLLOW_UP'" :table="table"
                            :projectTypes="projectTypes" :isOwner="false" @saveProjectEvent="saveProject" />
                        <ReceivableGuaranteeDetail v-if="props.workbenchDetailType == 'RECEIVABLE_GUARANTEE_PROJECT'"
                            :table="table" :projectTypes="projectTypes" :isOwner="false"
                            @saveProjectEvent="saveProject" />
                        <!-- 子表格部分 -->
                        <div class="child-table-section">
                            <div class="app-container">
                                <div class="table-container">
                                    <div class="table-header">跟进记录</div>

                                    <el-table :data="table.followRecords" @row-click="openDetailDialog"
                                        @selection-change="handleRecordSelectionChange">
                                        <!-- <el-table-column type="selection" align="center"></el-table-column> -->
                                        <el-table-column prop="endTime" label="时间" width="299">
                                            <template #default="{ row }">
                                                <!-- <div class="time-range">
                                                    <i class="fas fa-clock"></i>
                                                    <span>{{ row.startTime }}</span>
                                                </div> -->
                                                <div style="position: relative;">
                                                    <div class="time-range">
                                                        <!-- <i class="fas fa-clock"></i> -->
                                                        <img src="./icon/日历.png" alt=""
                                                            style="height: 32px; width: 32px;">
                                                        <div
                                                            style="font-size: 16px; font-weight: 400px; position: relative; left:10px; top:6px">
                                                            {{ row.startTime }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="record" label="记录" :show-overflow-tooltip="true"
                                            align="center" width="438">
                                            <template #default="{ row }">
                                                <!-- <div class="record-cell">{{ truncateText(row.record, 10) }}</div> -->
                                                <el-tooltip effect="dark" :content="row.record" placement="top"
                                                    :disabled="row.record?.length <= 10">
                                                    <div class="record-cell">
                                                        {{ truncateText(row.record, 10) }}
                                                    </div>
                                                </el-tooltip>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="predictTarget" label="预期目标" :show-overflow-tooltip="true"
                                            align="center" width="398">
                                            <template #default="{ row }">
                                                <!-- <div class="record-cell">{{ truncateText(row.predictTarget, 10) }}</div> -->
                                                <el-tooltip effect="dark" :content="row.predictTarget" placement="top"
                                                    :disabled="row.predictTarget?.length <= 10">
                                                    <div class="record-cell">
                                                        {{ truncateText(row.predictTarget, 10) }}
                                                    </div>
                                                </el-tooltip>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="nextPlan" label="下一步计划" :show-overflow-tooltip="true"
                                            align="center" width="315">
                                            <template #default="{ row }">
                                                <!-- <div class="record-cell">{{ truncateText(row.nextPlan, 10) }}</div> -->
                                                <el-tooltip effect="dark" :content="row.nextPlan" placement="top"
                                                    :disabled="row.nextPlan?.length <= 10">
                                                    <div class="record-cell">
                                                        {{ truncateText(row.nextPlan, 10) }}
                                                    </div>
                                                </el-tooltip>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="协调" align="center">
                                            <template #default="{ row }">
                                                <!-- <el-button class="coordination-btn" @click="openCoordination(row)"
                                                    v-if="isOwner">
                                                    <i class="fas fa-users"></i> 进入协调
                                                </el-button> -->
                                                <span>仅负责人可操作</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div class="footer-panel">
                                    <el-button class="add-btn" style="position: relative; left: 41px;"
                                        @click="openAddForm" disabled="true">
                                        <i class="fas fa-plus"></i> + 新增
                                    </el-button>
                                    <!-- <el-button class="rmv-btn" style="position: relative; left: 80px;"
                                        @click="removeRecords(table)" :disabled="!table.saved" v-if="isOwner">
                                        <i class="fas fa-trash"></i> - 移除
                                    </el-button> -->

                                    <el-pagination class="record-page-panel" background layout="prev, pager, next"
                                        :total="table.total" :page-size="table.pageSize"
                                        :current-page="table.currentPage"
                                        @current-change="(page: any) => handlePageChange(page, index)">
                                    </el-pagination>
                                </div>
                            </div>
                        </div>
                        <!-- 变更记录表格 -->
                        <div class="change-record-section">
                            <div class="app-container">
                                <div class="table-container">
                                    <div class="table-header">变更记录</div>
                                    <el-table :data="table.changeRecords" style="width: 100%">
                                        <el-table-column prop="createTime" label="时间" width="299">
                                            <template #default="{ row }">
                                                <!-- <div class="time-range">
                                                    <i class="fas fa-clock"></i>
                                                    <span>{{ row.createTime }}</span>
                                                </div> -->
                                                <div style="position: relative;">
                                                    <div class="time-range">
                                                        <!-- <i class="fas fa-clock"></i> -->
                                                        <img src="./icon/日历.png" alt=""
                                                            style="height: 32px; width: 32px;">
                                                        <div
                                                            style="font-size: 16px; font-weight: 400px; position: relative; left:10px; top:6px">
                                                            {{ row.createTime }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="username" label="变更人" width="180">
                                            <template #default="{ row }">
                                                <div class="record-cell">{{ row.username }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="departName" label="变更部门" width="180">
                                            <template #default="{ row }">
                                                <div class="record-cell">{{ row.departName }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="description" label="变更动作" width="968">
                                            <template #default="{ row }">
                                                <!-- <div class="record-cell">{{ row.description }}</div> -->
                                                <el-tooltip effect="dark" :content="row.description" placement="top"
                                                    :disabled="row.description?.length <= 30">
                                                    <div class="record-cell">
                                                        {{ truncateText(row.description, 30) }}
                                                    </div>
                                                </el-tooltip>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div class="footer-panel">
                                    <el-pagination class="record-page-panel" background layout="prev, pager, next"
                                        :total="table.changeTotal" :page-size="table.changePageSize"
                                        :current-page="table.changeCurrentPage"
                                        @current-change="(page: any) => changeRecordhandlePageChange(page, index)">
                                    </el-pagination>
                                    <div class="change-page-select">
                                        <el-select v-model="table.changePageSize"
                                            @change="changeRecordhandlePageSizeChange(index)"
                                            :suffix-icon="SelectIcon2">
                                            <!-- style="height: 32px; width: 120px; margin-right: 24px; border: 1px solid black; border-radius: 4px;" -->
                                            <el-option :value="3" label="3条/页"></el-option>
                                            <el-option :value="5" label="5条/页"></el-option>
                                            <el-option :value="10" label="10条/页"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 半透明灰色遮罩层 -->
                    <!-- <div v-if="table.projectInfo.status == 'PLACE_ON_FILE'" class="overlay"></div> -->
                </div>
            </div>
        </div>
        <!-- 协调管理对话框 -->
        <el-dialog v-model="coordinationDialogVisible" title="协调管理" width="1200px" height="800px"
            class="rounded-dialog">
            <div>
                <el-table :data="coordinationData" class="coordination-table" border
                    @selection-change="handleCoordinationSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="时间" width="299" align="center">
                        <template #default="{ row }">
                            <!-- <div class="time-range">
                                <span>{{ row.startTime || "未设置" }}</span>
                            </div> -->
                            <div style="position: relative;">
                                <div class="time-range">
                                    <!-- <i class="fas fa-clock"></i> -->
                                    <img src="./icon/日历1.png" alt="" style="height: 32px; width: 32px;">
                                    <div
                                        style="font-size: 16px; font-weight: 400px; position: relative; left:10px; top:6px">
                                        {{ row.startTime || "未设置" }}
                                    </div>
                                </div>
                            </div>

                        </template>
                    </el-table-column>
                    <el-table-column prop="depart" label="协调部门" align="center" width="180">
                        <template #default="{ row }">
                            <span>{{ row.depart }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="coUser" label="协调人员" align="center" width="180">
                        <template #default="{ row }">
                            <span>{{ row.coUser }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="协调内容" align="center" width="442">
                        <template #default="{ row }">
                            <el-tooltip effect="dark" :content="row.content" placement="top"
                                :disabled="row.content?.length <= 10">
                                <div class="record-cell">
                                    {{ truncateText(row.content, 10) }}
                                </div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="coordination-actions">
                    <div class="action-buttons">
                        <el-button class="add-btn" @click="addCoordination">
                            <i class="fas fa-plus"></i> + 添加
                        </el-button>
                        <el-button class="rmv-btn" @click="removeCoordination">
                            <i class="fas fa-trash"></i> - 移除
                        </el-button>
                    </div>

                    <!-- <div class="dialog-buttons">
            <el-button class="cancel-btn" @click="coordinationDialogVisible = false">
              <i class="fas fa-times"></i> 退出
            </el-button>
          </div> -->
                </div>
            </div>
        </el-dialog>
        <!-- 添加新的协调表单对话框 -->
        <el-dialog v-model="newCoordinationVisible" title="新增协调记录" width="700px" class="rounded-dialog">
            <el-form :model="newCoordination" class="new-coordination-form" label-width="80px">
                <el-form-item label="协调时间" style="margin-bottom: 24px">
                    <div class="time-range" style="padding: 0px;">
                        <el-date-picker v-model="newCoordination.startTime" type="datetime" value-format="YYYY-MM-DD"
                            format="YYYY-MM-DD" :disabled-date="disabledDate" :prefix-icon="TimeIcon">
                        </el-date-picker>
                    </div>
                </el-form-item>

                <el-form-item label="协调部门" style="margin-bottom: 24px">
                    <el-select v-model="newCoordination.depart" placeholder="请选择"
                        @change="(val: any) => handleDepartIDChange(val)">
                        <el-option v-for="item in departmentOptions" :key="item.departId" :label="item.departmentName"
                            :value="item.departId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="协调人员" style="margin-bottom: 24px">
                    <el-select v-model="newCoordination.coUser" placeholder="请选择">
                        <el-option v-for="item in personOptions" :key="item.coordinatorId" :label="item.coordinatorName"
                            :value="item.coordinatorId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="协调内容" style="margin-bottom: 24px">
                    <el-input v-model="newCoordination.content" type="textarea" rows="4" :maxlength="textMaxLength"
                        show-word-limit placeholder="请输入填写">
                    </el-input>
                </el-form-item>
                <div class="dialog-footer">
                    <el-button class="cancel-btn" @click="newCoordinationVisible = false">取消</el-button>
                    <el-button class="record-save-btn" @click="saveNewCoordination">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 新增跟进记录对话框 -->
        <el-dialog v-model="addDialogVisible" title="新增跟进记录" width="800px" class="rounded-dialog">
            <div class="form-container">
                <!-- 添加统一的标签样式 -->
                <el-form :model="newRecord" label-width="0px" ref="addForm">
                    <label>时间</label>
                    <el-form-item class="record-input-area" :rules="timeRules" style="margin-bottom: 24px">
                        <div class="time-range-container">
                            <el-date-picker v-model="newRecord.startTime" type="datetime"
                                value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm" style="width: 222px;"
                                :prefix-icon="TimeIcon">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <label for="">记录内容</label>
                    <el-form-item class="record-input-area" prop="record"
                        :rules="[{ required: true, message: '记录内容不能为空' }]" style="margin-bottom: 24px">
                        <el-input v-model="newRecord.record" type="textarea" :rows="3" placeholder="请输入填写"
                            :maxlength="textMaxLength" show-word-limit>
                        </el-input>
                    </el-form-item>
                    <label for="">预期目标</label>
                    <el-form-item class="record-input-area" style="margin-bottom: 24px">
                        <el-input v-model="newRecord.predictTarget" type="textarea" :rows="2" placeholder="请输入填写"
                            :maxlength="50" show-word-limit>
                        </el-input>
                    </el-form-item>
                    <label for="">下一步计划</label>
                    <el-form-item class="record-input-area" style="margin-bottom: 24px">
                        <el-input v-model="newRecord.nextPlan" type="textarea" :rows="2" placeholder="请输入填写"
                            :maxlength="textMaxLength" show-word-limit>
                        </el-input>
                    </el-form-item>
                    <div class="dialog-footer">
                        <el-button class="cancel-btn" @click="addDialogVisible = false">
                            <i class="fas fa-times"></i> 取消
                        </el-button>
                        <el-button class="record-save-btn" @click="saveNewRecord(currentIndex)">
                            <i class="fas fa-save"></i> 保存
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <!-- 跟进记录详情对话框 -->
        <el-dialog v-model="detailDialogVisible" title="跟进记录" width="800px" class="rounded-dialog">
            <div class="form-container">
                <!-- 添加统一的标签样式 -->
                <el-form :model="currentRecordDetail" label-width="0px" ref="addForm" :disabled="!isEditing">
                    <label>时间</label>
                    <el-form-item class="record-input-area" :rules="timeRules" style="margin-bottom: 24px">
                        <div class="time-range-container">
                            <el-date-picker v-model="currentRecordDetail.startTime" type="datetime"
                                value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm" style="width: 222px;"
                                :prefix-icon="TimeIcon">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <label for="">记录内容</label>
                    <el-form-item class="record-input-area" prop="record"
                        :rules="[{ required: true, message: '记录内容不能为空' }]" style="margin-bottom: 24px">
                        <el-input v-model="currentRecordDetail.record" type="textarea" :rows="3" placeholder="请输入填写"
                            :maxlength="textMaxLength" show-word-limit>
                        </el-input>
                    </el-form-item>
                    <label for="">预期目标</label>
                    <el-form-item class="record-input-area" style="margin-bottom: 24px">
                        <el-input v-model="currentRecordDetail.predictTarget" type="textarea" :rows="2"
                            placeholder="请输入填写" :maxlength="50" show-word-limit>
                        </el-input>
                    </el-form-item>
                    <label for="">下一步计划</label>
                    <el-form-item class="record-input-area" style="margin-bottom: 24px">
                        <el-input v-model="currentRecordDetail.nextPlan" type="textarea" :rows="2" placeholder="请输入填写"
                            :maxlength="textMaxLength" show-word-limit>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div class="dialog-footer">
                <template v-if="!isEditing">
                    <el-button class="cancel-btn" @click="detailDialogVisible = false">
                        <i class="fas fa-times"></i> 关闭
                    </el-button>
                    <el-button class="record-save-btn" @click="enableEditing">
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
        <el-dialog v-model="deliverDialogVisible" title="项目转交" width="500px" class="rounded-dialog">
            <!-- <div class="dialog-header">
                项目转交
            </div> -->

            <div class="form-container">
                <el-form :model="deliverRecord" class="deliver-form" label-width="0px" ref="deliverForm">
                    <label>项目名称：</label>
                    <el-form-item prop="projectName" style="margin-bottom: 24px">
                        <el-input v-model="deliverRecord.projectName" type="text" :rows="3" placeholder="请输入填写"
                            :disabled="true" class="low-opacity">
                        </el-input>
                    </el-form-item>
                    <label>项目进度：</label>
                    <el-form-item prop="projectProgress" style="margin-bottom: 24px">
                        <el-input v-model="deliverRecord.projectProgress" type="text" :rows="2" placeholder="请输入填写"
                            :disabled="true" class="low-opacity">
                        </el-input>
                    </el-form-item>
                    <label>转交同事：</label>
                    <el-form-item prop="userID" style="margin-bottom: 24px">
                        <el-select v-model="deliverRecord.userID" :rows="2" placeholder="请选择同事">
                            <el-option v-for="item in personOptions" :key="item.id" :label="item.realName"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <label>转交日期：</label>
                    <el-form-item prop="transmitTime" :rules="timeRules" style="margin-bottom: 24px">
                        <el-input v-model="deliverRecord.transmitTime" type="text" :rows="1" :disabled="true">
                            <template #prefix>
                                <img src="./icon/日历1.png" style="height: 32px; width: 32px;" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <div class="dialog-footer">
                        <el-button class="cancel-btn" @click="deliverDialogVisible = false">
                            <i class="fas fa-times"></i> 取消
                        </el-button>
                        <el-button class="record-save-btn" @click="saveDeliverRecord(currentIndex)">
                            <i class="fas fa-save"></i> 保存
                        </el-button>
                    </div>
                </el-form>
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

import {
    addProjectCoordinate,
    deleteProjectCoordinate,
    deleteProjectRecord,
    getChangeList,
    getCoordinatorNameMenu,
    getDepartmentNameMenu,
    getProgressNext,
    getProjectCoordinate,
    getProjectDetail,
    getProjectId,
    getProjectProgressList,
    getProjectRecordList,
    getUsersByDepartID,
    insertOrUpdate,
    InsertRecord,
    projectTransmit,
    updateProjectStatus,
    updateRecord,
} from "@/api/website";
import { ElMessage, ElMessageBox, progressProps } from "element-plus";
import {
    createApp,
    ref,
    reactive,
    onMounted,
    nextTick,
    computed,
    toRefs,
    defineProps,
    onUnmounted,
    watch,
    watchEffect,
} from "vue";
import {
    type ParentTable,
    type ParentTables,
    type Tasks,
    type FollowRecords,
    type ChangeRecords,
} from "@/plan_types";
import { departListAllDeps, userListUsers } from "@/api/backstage";
import { getUserInfo } from "@/api";
import { getUnitTypes } from "@/api/website/my_office/Workspace";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import router from "@/router";
import EducationSystemADetail from "./EducationSystemADetail.vue";
import paymentCollectionDetail from './oldpaymentCollectionDetail.vue'
import PartnerFollowUpDetail from './oldPartnerFollowUpDetail.vue'
import ReceivableGuaranteeDetail from './oldReceivableGuaranteeDetail.vue'
import SelectIcon from "./icon/SelectDownIcon.vue";
import TimeIcon from './icon/Time.vue'
import SelectIcon2 from './icon/SelectDownIcon2.vue'
import DateIcon from './icon/DateIcon.vue'

// import { watch } from 'fs';
// 父表格数据
const parentTables: any = ref([]);

const currentIndex = ref(0);
// const parentTable: any = computed((parentTables, currentIndex) => parentTables[currentIndex])
const currentAction = ref();
const connectors: any = ref([]);
const ref_parentTables: any = ref([]);
const ref_taskNodes: any = ref([]);
// const ref_taskCircles: any = ref([]);
const ref_task_flow: any = ref([]);
const props = withDefaults(
    defineProps<{
        workbenchDetailID: any,
        workbenchDetailType: any,
        workbenchDetailUserID: any,
        workbenchDetailProjectName: any
    }>(),
    {}
);

// console.log('plan-staff传入的props.workbenchDetailType为。。。。', props.workbenchDetailType);
const currentUser: any = ref(getUserName());
const isOwner = computed(() => {
    if (!currentUser.value || !props.workbenchDetailUserID) {

        return false;
    }
    // console.log('currentUser.value和props.workbenchDetailUserID分别为', currentUser.value, props.workbenchDetailUserID);
    // console.log('');

    return currentUser.value == props.workbenchDetailUserID;
});

const projectIDs: any = ref([]);
const projectProgress: any = ref([]);
const projectDetail: any = ref([]);
const projectRecord: any = ref([]);
const projectChangeList: any = ref([]);
// const unitRes = await getUnitTypes();
let projectTypes: any = ref([]);
const textMaxLength = ref(400)

// 当前操作的记录
const currentRecord: any = ref({});

// 协调管理对话框可见性
const coordinationDialogVisible = ref(false);

// 协调数据表
const coordinationData: any = ref([]);

// 新增状态和数据处理
const newCoordinationVisible = ref(false);
const newCoordination: any = reactive({
    coUser: "",
    content: "",
    depart: "",
    endTime: "",
    projectId: 0,
    recordId: 0,
    startTime: "",
});

// 存储选中的协调记录
const selectedCoordinations = ref<any[]>([]);

// 人员选项
const personOptions: any = ref([]);

// 部门选项
const departmentOptions: any = ref([]);

// 新增记录对话框可见性
const addDialogVisible = ref(false);

// 新记录表单数据
interface newRecordType {
    [key: string]: string;
}

// 时间验证规则
const timeRules = [
    { required: true, message: "请选择时间", trigger: "change" },
    { validator: validateTime, trigger: "change" },
];

const paginatedRecords = computed(() => {
    let Records = [];
    for (let i = 0; i < parentTables.value.length; i++) {
        const start =
            (parentTables.value[i].currentPage - 1) * parentTables.value[i].pageSize;
        const end = start + parentTables.value[i].pageSize;
        Records.push(parentTables.value[i].followRecords.slice(start, end));
    }
    return Records;
});

//记录暂存
const newRecord: any = reactive({
    startTime: "",
    endTime: "",
    record: "",
    predictTarget: "",
    nextPlan: "",
});

// 跟进记录详情对话框可见性
const detailDialogVisible = ref(false);
// 当前选中的跟进记录详情
const currentRecordDetail: any = ref({});
// 是否处于编辑状态
const isEditing = ref(false);
// 原始记录数据（用于取消修改时恢复）
const originalRecord: any = ref({});

// 存储选中的记录
const selectedRecords = ref<any[]>([]);

// 变更记录表格部分
const changeRecordCurrentPage = ref(1);
const changeRecordPageSize = ref(3);

const changesRecords = ref([
    {
        time: "2023-10-15 09:00",
        // startTimestamp: '2023-10-15 09:00',
        // endTimestamp: '2023-10-15 11:30',
        changeMan:
            "与客户进行需求分析会议，明确了项目的主要功能点和设计要求。客户对初步设计方案表示满意，提出了一些改进建议。",
        changeDepartment: "完成需求规格说明书初稿",
        changeAction: "根据客户反馈修改设计方案，准备下一轮评审",
    },
    {
        time: "2023-10-15 09:00",
        // startTimestamp: '2023-10-15 09:00',
        // endTimestamp: '2023-10-15 11:30',
        changeMan:
            "与客户进行需求分析会议，明确了项目的主要功能点和设计要求。客户对初步设计方案表示满意，提出了一些改进建议。",
        changeDepartment: "完成需求规格说明书初稿",
        changeAction: "根据客户反馈修改设计方案，准备下一轮评审",
    },
    {
        time: "2023-10-15 09:00",
        // startTimestamp: '2023-10-15 09:00',
        // endTimestamp: '2023-10-15 11:30',
        changeMan:
            "与客户进行需求分析会议，明确了项目的主要功能点和设计要求。客户对初步设计方案表示满意，提出了一些改进建议。",
        changeDepartment: "完成需求规格说明书初稿",
        changeAction: "根据客户反馈修改设计方案，准备下一轮评审",
    },
]);

const deliverDialogVisible = ref(false);
// 新记录表单数据
interface deliverRecordType {
    [key: string]: string;
}
const deliverRecord: deliverRecordType = reactive({
    projectName: "",
    projectProgress: "",
    userName: "",
    userID: "",
    transmitTime: "",
});

//////////////////////////////////////////////////////////////////////// 方法定义部分  ///////////////////////

function projectRecovery(projectID: any, projectStatus: any, projectStatusMsg: any) {
    console.log('点击了项目恢复。。。');

    // 添加二次确认
    ElMessageBox.confirm(
        "确定要恢复项目吗？",
        "确认恢复项目",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(() => {
            const dto = {
                projectId: projectID,
                projectStatus: projectStatus,
                projectStatusMsg: projectStatusMsg,
            };
            updateProjectStatus(dto).then((res: any) => {
                if (res.code == 200) {
                    ElMessage.success("项目恢复成功。");
                    router.back()
                } else {
                    ElMessage.warning(res.msg);
                }
            });
        })
        .catch(() => {
            // 用户取消操作
        });
}

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
            { content: "已拜访邀约体验", status: "NOT_FINISHED", finishTime: "" },
            { content: "已到公司体验", status: "NOT_FINISHED", finishTime: "" },
            { content: "已报方案", status: "NOT_FINISHED", finishTime: "" },
            { content: "阳光推荐会确定方案", status: "NOT_FINISHED", finishTime: "" },
            { content: "方案上会", status: "NOT_FINISHED", finishTime: "" },
            { content: "客户各级审批", status: "NOT_FINISHED", finishTime: "" },
            {
                content: "财政局财评立项通过会",
                status: "NOT_FINISHED",
                finishTime: "",
            },
            { content: "采购需求确定", status: "NOT_FINISHED", finishTime: "" },
            { content: "招标文件拟定", status: "NOT_FINISHED", finishTime: "" },
            { content: "挂网招标", status: "NOT_FINISHED", finishTime: "" },
            { content: "投标中标", status: "NOT_FINISHED", finishTime: "" },
            { content: "合同签订", status: "NOT_FINISHED", finishTime: "" },
            { content: "施工调试", status: "NOT_FINISHED", finishTime: "" },
            { content: "供应商内部验收", status: "NOT_FINISHED", finishTime: "" },
            { content: "培训", status: "NOT_FINISHED", finishTime: "" },
            { content: "试运行", status: "NOT_FINISHED", finishTime: "" },
            { content: "正式验收", status: "NOT_FINISHED", finishTime: "" },
            { content: "开票付款", status: "NOT_FINISHED", finishTime: "" },
            { content: "售后巡检", status: "NOT_FINISHED", finishTime: "" },
            { content: "二次开发", status: "NOT_FINISHED", finishTime: "" },
        ],
        connectors: [],
        projectInfo: {
            // unitName: "",
            // type: props.workbenchDetailType,
            // departName: "",
            // commander: "",
            // projectName: "",
            // budgetMoney: "",
            // startTime: "",
            acceptedContractMoney: "",
            backTime: "",
            budgetMoney: "",
            checkFlag: "",
            coIntentionalProject: "",
            coIntentionalUnit: "",
            commander: "",
            contact: "",
            departName: "",
            employeeId: "",
            guaranteeExpireTime: "",
            guaranteeMoney: "",
            guaranteePeriod: "",
            id: "",
            payType: "",
            performanceBondMoney: "",
            preMoney: "",
            progressMoney: "",
            projectName: "",
            startTime: "",
            status: "",
            type: props.workbenchDetailType,
            unitName: "",
            unitType: ""
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
                username: "",
            },
        ],
        changeTotal: 0,
        changeCurrentPage: 1,
        changePageSize: 3,
    };
}

// 安全获取用户信息
function getUserName() {
    try {
        const userData = localStorage.getItem("user");
        if (!userData) return "未知用户";
        const user = JSON.parse(userData);
        return user?.id || "未知用户";
    } catch (e) {
        console.error("解析用户信息失败", e);
        return "未知用户";
    }
};

function calculateConnectors(tableIndex: any) {
    const table = parentTables.value[tableIndex];
    const connectors = [];
    const taskCount = table.tasks.length;

    // 获取当前表格的 DOM 引用
    const tableContainer = ref_task_flow.value[tableIndex];
    if (!tableContainer) return [];

    // 获取当前表格内的所有任务圆圈
    const circles = tableContainer.querySelectorAll('.task-circle');

    for (let i = 1; i < taskCount; i++) {
        const currentCircle = circles[i];
        const lastCircle = circles[i - 1];

        if (!currentCircle || !lastCircle) continue;

        // 获取位置信息（保持不变）
        const currentRect = currentCircle.getBoundingClientRect();
        const lastRect = lastCircle.getBoundingClientRect();
        const fatherRect = tableContainer.getBoundingClientRect();

        // 计算坐标（保持不变）
        const currentCenterX = currentRect.left - fatherRect.left + currentRect.width / 2;
        const currentCenterY = currentRect.top - fatherRect.top + currentRect.height / 2;

        const lastCenterX = lastRect.left - fatherRect.left + lastRect.width / 2;
        const lastCenterY = lastRect.top - fatherRect.top + lastRect.height / 2;

        // 确定连接线类型（保持不变）
        const isSameRow = Math.abs(currentCenterY - lastCenterY) < 50;
        let path = "";

        if (isSameRow) {
            path = `M ${lastCenterX} ${lastCenterY} L ${currentCenterX} ${currentCenterY}`;
        } else {
            const midX = (currentCenterX + lastCenterX) / 2;
            path = `M ${lastCenterX} ${lastCenterY} C ${midX} ${currentCenterY}, ${midX} ${lastCenterY}, ${currentCenterX} ${currentCenterY}`;
        }

        connectors.push({
            d: path,
            status: table.tasks[i].status,
        });
    }

    return connectors;
}

// 更新所有连接线
function updateAllConnectors() {
    nextTick(() => {
        // console.log('!!!!!!!!!!!!!!!!!!!!!!!In updateAllConnectors updateAllConnectors updateAllConnectors updateAllConnectors!!!!!!!!');
        // console.log(ref_parentTables.value);
        // console.log(ref_taskNodes.value);

        connectors.value = document.querySelector(".connectors");

        if (!connectors.value) return;

        parentTables.value.forEach((table: any, index: any) => {
            table.connectors = calculateConnectors(index);
            // console.log('table.connectors====================##############', table.connectors);
        });
    });
}

function centerActiveTaskInFlow(tableIndex:any) {
  nextTick(() => {
    // 获取当前表格的任务流程容器
    console.log('进入了centerActiveTaskInFlow函数,,,ref_task_flow为...',ref_task_flow.value);
    
    const taskFlowContainer = ref_task_flow.value[tableIndex];
    console.log('当前的项目进度流程对象为',taskFlowContainer);
    
    if (!taskFlowContainer) return;
    
    // 查找当前进行中的任务节点
    const table = parentTables.value[tableIndex];
    const activeTaskIndex = table.tasks.findIndex((task:any) => task.status === "DOING");
    if (activeTaskIndex === -1) return;
    console.log('当前正在进行的任务下标为',activeTaskIndex);
    
    // 获取进行中的任务节点
    const taskNodes = taskFlowContainer.querySelectorAll('.task-node-container');
    if (!taskNodes[activeTaskIndex]) return;
    console.log('当前流程图下的所有节点为',taskNodes);
    
    // 获取进行中任务节点的位置信息
    const activeTaskNode = taskNodes[activeTaskIndex];
    console.log('当前正在进行的任务节点对象为',activeTaskNode,'距离左边的距离为',activeTaskNode.offsetLeft);
    const containerWidth = taskFlowContainer.offsetWidth;
    console.log('当前流程图的宽度为',containerWidth);
    const activeTaskRect = activeTaskNode.getBoundingClientRect();
    console.log('当前节点的视窗距离为',activeTaskRect.width);
    const containerRect = taskFlowContainer.getBoundingClientRect();
    
    // 计算需要滚动的位置，使活动任务居中
    const scrollLeft = activeTaskNode.offsetLeft - (containerWidth / 2) + (activeTaskRect.width / 2);
    console.log('计算得到的滚动距离为',scrollLeft);
    
    // 平滑滚动到指定位置
    taskFlowContainer.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  });
}

// 处理操作选择
function handleActionChange(tableIndex: any) {
    console.log("处理操作变化了");
    console.log("tableIndex<<<<<<<", tableIndex);

    const table = parentTables.value[tableIndex];

    if (currentAction.value === "complete") {
        console.log('点击了"下一步"');
        currentAction.value = null;
        console.log(table);

        const currentTaskIndex = table.tasks.findIndex(
            (task: any) => task.status === "DOING"
        );
        console.log("table.projectID:::::", table.projectID);

        console.log(table.tasks[currentTaskIndex].id);
        console.log(table.tasks[currentTaskIndex].content);
        console.log(table.tasks[currentTaskIndex].progressDetailId);
        console.log(table.projectID);

        console.log(
            currentTaskIndex >= table.tasks.length - 1
                ? null
                : table.tasks[currentTaskIndex + 1].id
        );
        console.log(
            currentTaskIndex >= table.tasks.length - 1
                ? null
                : table.tasks[currentTaskIndex + 1].content
        );
        console.log(
            currentTaskIndex >= table.tasks.length - 1
                ? null
                : table.tasks[currentTaskIndex + 1].progressDetailId
        );
        console.log(table.projectID);

        let currentProgress = {
            id: table.tasks[currentTaskIndex].id,
            progressContent: table.tasks[currentTaskIndex].content,
            progressDetailId: table.tasks[currentTaskIndex].progressDetailId,
            projectId: table.projectID,
        };
        let nextProgress = {
            id:
                currentTaskIndex >= table.tasks.length - 1
                    ? null
                    : table.tasks[currentTaskIndex + 1].id,
            progressContent:
                currentTaskIndex >= table.tasks.length - 1
                    ? null
                    : table.tasks[currentTaskIndex + 1].content,
            progressDetailId:
                currentTaskIndex >= table.tasks.length - 1
                    ? null
                    : table.tasks[currentTaskIndex + 1].progressDetailId,
            projectId: table.projectID,
        };
        let DTO = {
            currentProgressDTO: currentProgress,
            nextProgressDTO: nextProgress,
        };
        console.log("DTO", DTO);

        getProgressNext(DTO).then((res: any) => {
            if (res.code == 200) {
                console.log("成功调用getProgressNext接口");
                console.log("res.data==", res.data);
                // completeCurrentTask(tableIndex);
                refreshProgress(table.projectID || "", props.workbenchDetailType);
                refreshChangeRecord(
                    table.changeCurrentPage,
                    table.changePageSize,
                    "create_time desc",
                    table.projectID || ""
                );
            } else {
                // console.log(res.msg);
                ElMessage.warning(res.msg);
            }
        });
    } else if (currentAction.value === "pause") {
        currentAction.value = null;
        const dto = {
            projectId: parentTables.value[tableIndex].projectID,
            projectStatus: "PAUSE",
            projectStatusMsg: "项目暂停",
        };
        updateProjectStatus(dto).then((res: any) => {
            if (res.code == 200) {
                ElMessage.success("项目已暂停");
                table.paused = true;
                table.projectInfo.status = "PAUSE";

                updateAllConnectors();
                const projectId = table.projectID || "";
                refreshChangeRecord(
                    table.changeCurrentPage,
                    table.changePageSize,
                    "create_time desc",
                    projectId
                );
            } else {
                ElMessage.warning(res.msg);
            }
        });
    } else if (currentAction.value === "resume") {
        currentAction.value = null;
        const dto = {
            projectId: parentTables.value[tableIndex].projectID,
            projectStatus: "NORMAL",
            projectStatusMsg: "项目开始",
        };
        updateProjectStatus(dto).then((res: any) => {
            if (res.code == 200) {
                ElMessage.success("项目已启动");
                table.paused = false;
                table.projectInfo.status = "NORMAL";

                updateAllConnectors();
                const projectId = table.projectID || "";
                refreshChangeRecord(
                    table.changeCurrentPage,
                    table.changePageSize,
                    "create_time desc",
                    projectId
                );
            } else {
                ElMessage.warning(res.msg);
            }
        });
    } else if (currentAction.value === "over") {
        currentAction.value = null;
        const preParentTablesLength = parentTables.value.length;
        // let currentProjectID = parentTables.value[index].projectID;

        // 添加二次确认
        ElMessageBox.confirm(
            "确定要结束项目吗？项目结束后将无法修改",
            "确认结束项目",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }
        )
            .then(() => {
                const dto = {
                    projectId: parentTables.value[tableIndex].projectID,
                    projectStatus: "PLACE_ON_FILE",
                    projectStatusMsg: "项目归档",
                };
                updateProjectStatus(dto).then((res: any) => {
                    if (res.code == 200) {
                        ElMessage.success("归档成功，项目已删除");
                        table.isEnded = true;
                        table.projectInfo.status = "PLACE_ON_FILE";
                        //删除归档项目
                        parentTables.value.splice(tableIndex, 1);
                        if (parentTables.value.length > 0) {
                            if (tableIndex == preParentTablesLength - 1) {
                                goToTable(tableIndex - 1);

                                console.log(`项目切换跳转到下标${tableIndex - 1}`);
                                console.log("当前currentindex为", currentIndex.value);
                            } else {
                                goToTable(tableIndex);

                                console.log(`项目切换跳转到下标${tableIndex}`);
                                console.log("当前currentindex为", currentIndex.value);
                            }
                        }

                        updateAllConnectors();
                        const projectId = table.projectID || "";
                        refreshChangeRecord(
                            table.changeCurrentPage,
                            table.changePageSize,
                            "create_time desc",
                            projectId
                        );
                    } else {
                        ElMessage.warning(res.msg);
                    }
                });
            })
            .catch(() => {
                // 用户取消操作
            });
    }
}

// function name(params:type) {

// }

// 完成当前任务
function completeCurrentTask(tableIndex: any) {
    const table = parentTables.value[tableIndex];
    // 找到当前进行中的任务
    const currentTaskIndex = table.tasks.findIndex(
        (task: any) => task.status === "DOING"
    );

    if (currentTaskIndex >= 0) {
        // 更新任务状态
        table.tasks[currentTaskIndex].status = "FINISHED";
        table.tasks[currentTaskIndex].finishTime = new Date().toLocaleDateString();

        // 激活下一个任务
        if (currentTaskIndex < table.tasks.length - 1) {
            table.tasks[currentTaskIndex + 1].status = "DOING";
        }
    }
    //初始情况
    else {
        table.tasks[0].status = "DOING";
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
        if (a > b) return 1;
        else return -1;
    } else {
        return (
            new Date(a.endTimestamp).getTime() - new Date(b.endTimestamp).getTime()
        );
    }
}

// 时间验证函数
function validateTime(rule: any, value: any, callback: any) {
    if (!newRecord.startTime || !newRecord.endTime) {
        callback();
        return;
    }

    const start = new Date(newRecord.startTime).getTime();
    const end = new Date(newRecord.endTime).getTime();

    if (start > end) {
        callback(new Error("开始时间不能晚于结束时间"));
    } else {
        callback();
    }
}

// 打开协调管理对话框
const openCoordination = (record: any) => {
    personOptions.value.length = 0;
    departmentOptions.value.length = 0;
    coordinationData.value.length = 0;
    currentRecord.value = record;
    console.log("打开了协调管理对话框,当前row为：：：：", record);
    getProjectCoordinate(record.id).then((res: any) => {
        if (res.code == 200) {
            console.log("成功请求协调数据");
            console.log("数据为：：：：：：：", res.data);

            coordinationData.value = [...res.data];
            coordinationDialogVisible.value = true;

            getDepartmentNameMenu().then((res: any) => {
                if (res.code == 200) {
                    // ElMessage.warning('成功查询所有部门信息。。')
                    departmentOptions.value = [...res.data];
                    console.log("departmentOptions...", departmentOptions.value);
                } else {
                    ElMessage.warning(res.msg);
                }
            });
        }
    });
};

// 限制时间选择只能选今天之前的日期
function disabledDate(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 今天的零点
    return date < today; // 只禁掉昨天及以前
}

function handleDepartIDChange(val: any) {
    newCoordination.coUser = null;
    let departID = val;
    getCoordinatorNameMenu(departID).then((res: any) => {
        if (res.code == 200) {
            // ElMessage.warning('成功根据部门获取所有员工信息》》》')
            personOptions.value = [...res.data];
            console.log("personOptions.value...", personOptions.value);
        } else {
            ElMessage.warning(res.msg);
        }
    });
}

//验证协调时间
const validateCoordinationTime = (row: any) => {
    if (!row.startTime || !row.endTime) {
        row.timeError = "";
        return;
    }

    const start = new Date(row.startTime).getTime();
    const end = new Date(row.endTime).getTime();

    if (start > end) {
        row.timeError = "开始时间不能晚于结束时间";
    } else {
        row.timeError = "";
        row.time = `${row.startTime}~${row.endTime}`;
        row.startTimestamp = row.startTime;
    }
};

//新增协调记录对话框

// 修改原有的 addCoordination 方法
const addCoordination = () => {
    // 重置表单
    Object.keys(newCoordination).forEach((key) => {
        newCoordination[key] = "";
    });
    newCoordinationVisible.value = true;
};

// 保存新协调记录
const saveNewCoordination = () => {
    // 验证逻辑...
    if (newCoordination.coUser == currentUser) {
        console.log(newCoordination.coUser, currentUser);

        ElMessage.warning('协调同事不能为自己')
        newCoordination.coUser = null
    }
    // 保存成功后
    coordinationData.value.push({ ...newCoordination });
    newCoordinationVisible.value = false;

    console.log("点击了保存协调数据，当前协调数据为");
    console.log(coordinationData.value);
    const tableIndex = parentTables.value.findIndex((table: any) => table.projectID == currentRecord.value.projectId)

    let coordinationDTO = {
        coUserId: newCoordination.coUser,
        content: newCoordination.content,
        departId: newCoordination.depart,
        endTime: newCoordination.endTime,
        projectId: currentRecord.value.projectId,
        recordId: currentRecord.value.id,
        projectName: parentTables.value[tableIndex].projectInfo.projectName,
        startTime: newCoordination.startTime,
        userId: currentUser,
    };
    console.log("coordinationDTO::::", coordinationDTO);

    addProjectCoordinate(coordinationDTO).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success("添加成功");
            coordinationDialogVisible.value = false;
        } else {
            ElMessage.warning(res.msg);
        }
    });
};

// 添加协调记录
// const addCoordination = () => {
//     coordinationData.value.unshift({
//         "coUser": "",
//         "content": "",
//         "depart": "",
//         "endTime": "",
//         "projectId": 0,
//         "recordId": 0,
//         "startTime": ""
//     });
// };

// 移除协调记录


// 处理协调记录选择变化
const handleCoordinationSelectionChange = (selection: any[]) => {
    selectedCoordinations.value = selection;
};

// 移除选中的协调记录
const removeCoordination = () => {
    console.log("点击了删除选中的协调记录");
    console.log("selectedCoordinations.value", selectedCoordinations.value);

    if (selectedCoordinations.value.length === 0) {
        ElMessage.warning("请选择要移除的协调记录");
        return;
    }

    // 获取选中记录的_tempId
    const selectedIds = selectedCoordinations.value.map((item) => item.id);
    console.log("selectedIds", selectedIds);

    // 过滤掉选中的记录
    deleteProjectCoordinate({ id: null, ids: selectedIds }).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success("成功删除协调数据。");

            selectedCoordinations.value.length = 0;
            coordinationDialogVisible.value = false;
        } else {
            ElMessage.warning(res.msg);
        }
    });
};

// 打开新增记录对话框
const openAddForm = () => {
    // 重置表单
    Object.keys(newRecord).forEach((key) => {
        newRecord[key] = "";
    });
    addDialogVisible.value = true;
};

// 文字截断函数
const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};


// 保存新记录
const saveNewRecord = (index: any) => {
    console.log("在新增记录中点击了“保存”");
    console.log("currentIndex======================", index);

    if (!newRecord.startTime || !newRecord.endTime || !newRecord.record) {
        ElMessage.warning("请填写必填字段（时间、记录内容）");
        return;
    }

    // 重置当前页到第一页
    parentTables.value[index].currentPage = 1;

    const newRecordDTO = {
        id: null,
        startTime: newRecord.startTime,
        endTime: newRecord.endTime,
        record: newRecord.record,
        predictTarget: newRecord.predictTarget || "暂无",
        projectId: parentTables.value[index].projectID,
        nextPlan: newRecord.nextPlan || "暂无",
        // coordination: []
    };
    console.log("newRecordDTO", newRecordDTO);

    InsertRecord(newRecordDTO).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success("新增记录成功。");
            const projectId = parentTables.value[index].projectID || "";
            refreshRecord(
                parentTables.value[index].currentPage,
                parentTables.value[index].pageSize,
                "start_time desc",
                projectId
            );
            refreshChangeRecord(
                parentTables.value[index].changeCurrentPage,
                parentTables.value[index].changePageSize,
                "create_time desc",
                parentTables.value[index].projectID
            );
            addDialogVisible.value = false;
        } else {
            ElMessage.warning(res.msg);
        }
    });

    // console.log('添加成功》》》parentTables.value[index]',parentTables.value[index]);
};

// 分页变化处理
const handlePageChange = (page: any, index: any) => {
    parentTables.value[index].currentPage = page;
    const projectId = parentTables.value[index].projectID || "";
    refreshRecord(
        parentTables.value[index].currentPage,
        parentTables.value[index].pageSize,
        "start_time desc",
        projectId
    );
};

//修改跟进记录部分

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
        startTime: currentRecordDetail.value.startTime,
    };

    // 调用更新接口
    updateRecord(updateData).then((res: any) => {
        if (res.code === 200) {
            // 刷新数据
            const index = parentTables.value.findIndex(
                (table: any) => table.projectID === updateData.projectId
            );

            if (index !== -1) {
                ElMessage.success("更新成功");
                refreshRecord(
                    parentTables.value[index].currentPage,
                    parentTables.value[index].pageSize,
                    "start_time desc",
                    updateData.projectId
                );
                refreshChangeRecord(
                    parentTables.value[index].changeCurrentPage,
                    parentTables.value[index].changePageSize,
                    "create_time desc",
                    updateData.projectId
                );
            }

            // 关闭对话框
            detailDialogVisible.value = false;
        } else {
            ElMessage.error(res.msg || "更新失败");
        }
    });
};

//删除记录

// 处理记录选择变化
const handleRecordSelectionChange = (selection: any[]) => {
    selectedRecords.value = selection;
};

// 移除选中的记录
const removeRecords = (table: any) => {
    console.log("点击了删除选中的记录");
    console.log("selectedRecords.value", selectedRecords.value);

    if (selectedRecords.value.length === 0) {
        ElMessage.warning("请选择要移除的协调记录");
        return;
    }

    // 获取选中记录的_tempId
    const selectedIds = selectedRecords.value.map((item) => item.id);
    console.log("selectedIds", selectedIds);

    // 过滤掉选中的记录
    deleteProjectRecord({ id: null, ids: selectedIds }).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success("已删除记录。");

            selectedRecords.value.length = 0;
            refreshRecord(
                table.currentPage,
                table.pageSize,
                "start_time desc",
                table.projectID || ""
            );
            refreshChangeRecord(
                table.changeCurrentPage,
                table.changePageSize,
                "create_time desc",
                table.projectID
            );
        } else {
            ElMessage.warning(res.msg);
        }
    });
};



function sortChangeRecordByDate(a: any, b: any) {
    if (a >= b) return 1;
    else return -1;
}

const changeRecordBatch = computed(() => {
    const start =
        (changeRecordCurrentPage.value - 1) * changeRecordPageSize.value;
    const end = start + changeRecordPageSize.value;
    return [...changesRecords.value]
        .sort(sortChangeRecordByDate)
        .slice(start, end);
});


// 分页变化处理
const changeRecordhandlePageChange = (page: any, index: any) => {
    changeRecordCurrentPage.value = page;
    parentTables.value[index].changeCurrentPage = page;
    refreshChangeRecord(
        parentTables.value[index].changeCurrentPage,
        parentTables.value[index].changePageSize,
        "create_time desc",
        parentTables.value[index].projectID
    );
};

//页大小设置处理
function changeRecordhandlePageSizeChange(index: any) {
    refreshChangeRecord(
        parentTables.value[index].changeCurrentPage,
        parentTables.value[index].changePageSize,
        "create_time desc",
        parentTables.value[index].projectID
    );
}

//添加项目转交信息

//打开项目转交对话框
function openDeliverForm(table: any) {
    personOptions.value.length = 0;
    departmentOptions.value.length = 0;

    const now = dayjs();

    let doingIndex = table.tasks.findIndex((task: any) => task.status == "DOING");
    // 重置表单
    deliverRecord.projectName = table.projectInfo.projectName;
    // deliverRecord.projectName = ""
    deliverRecord.projectProgress = table.tasks[doingIndex].content;
    deliverRecord.userName = "";
    deliverRecord.userID = "";
    deliverRecord.transmitTime = now.format("YYYY-MM-DD HH:mm");
    departListAllDeps().then((res: any) => {
        if (res.code == 200) {
            // ElMessage.warning('成功查询所有部门')
            deliverDialogVisible.value = true;
            const saleIndex = res.data.findIndex((dep: any) => dep.title == "销售部");
            const saleDepID = res.data[saleIndex].id;

            getUsersByDepartID(1, 9999, saleDepID).then((res: any) => {
                if (res.code == 200) {
                    // ElMessage.warning('成功查询销售部用户信息')
                    personOptions.value = [...res.data.list];
                } else {
                    ElMessage.warning(res.msg);
                }
            });
        } else {
            ElMessage.warning(res.msg);
        }
    });
}

//保存项目转交数据
function saveDeliverRecord(index: any) {
    const preParentTablesLength = parentTables.value.length;
    let currentProjectID = parentTables.value[index].projectID;
    // let userID = JSON.parse(localStorage.getItem('user')).id
    // console.log('currentProjectID:', currentProjectID, 'transmitTime==', deliverRecord.transmitTime, new Date(deliverRecord.transmitTime), 'userID==', userID, 'userName==', deliverRecord.userName);
    const dto = {
        projectName: deliverRecord.projectName,
        projectId: currentProjectID,
        transmitTime: deliverRecord.transmitTime,
        userId: deliverRecord.userID,
        userName:
            personOptions.value[
                personOptions.value.findIndex(
                    (item: any) => item.id == deliverRecord.userID
                )
            ].realName,
    };
    console.log("点击了保存转交数据，请求参数为");
    console.log(dto);

    projectTransmit(dto).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success("转交成功！");
            // refreshChangeRecord(
            //     parentTables.value[currentIndex].changeCurrentPage,
            //     parentTables.value[currentIndex].changePageSize,
            //     'create_time desc',
            //     currentProjectID
            // )
            parentTables.value.splice(index, 1);
            if (parentTables.value.length > 0) {
                if (index == preParentTablesLength - 1) {
                    goToTable(index - 1);

                    console.log(`项目切换跳转到下标${index - 1}`);
                    console.log("当前currentindex为", currentIndex.value);
                } else {
                    goToTable(index);

                    console.log(`项目切换跳转到下标${index}`);
                    console.log("当前currentindex为", currentIndex.value);
                }
            }

            deliverDialogVisible.value = false;
        } else {
            ElMessage.warning(res.msg);
        }
    });
}

//数组找不同
function findDifference(arr1: any, arr2: any) {
    const diff1 = arr1.filter((x: any) => !arr2.includes(x));
    const diff2 = arr2.filter((x: any) => !arr1.includes(x));
    return [...new Set([...diff1, ...diff2])];
}

//保存项目
function saveProject(table: any) {
    console.log("点击了保存项目。。。");

    if (!table.saved) {
        console.log(table.tasks, table.projectInfo);

        const firstTaskIndex = table.tasks.findIndex(
            (item: any) => item.number == 1
        );
        // console.log('table.tasks[firstTaskIndex]:::::', table.tasks[firstTaskIndex]);
        table.tasks[firstTaskIndex].id = null;

        // table.projectInfo.type = props.projectType
        const dto = {
            projectDTO: table.projectInfo,
            progressDTO: table.tasks[firstTaskIndex],
        };
        console.log("dto>>>>>>>>>", dto);

        insertOrUpdate(dto).then((res: any) => {
            if (res.code == 200) {
                ElMessage.success("保存成功");
                table.saved = true;
                refreshProjectAllData(props.workbenchDetailID, props.workbenchDetailType)
            } else {
                ElMessage.warning(res.msg);
            }
        });
    } else {
        const dto = {
            projectDTO: table.projectInfo,
            progressDTO: {},
        };
        console.log("dto>>>>>>>>>", dto);
        insertOrUpdate(dto).then((res: any) => {
            if (res.code == 200) {
                refreshDetail(table.projectID);
                refreshChangeRecord(
                    table.changeCurrentPage,
                    table.changePageSize,
                    "create_time desc",
                    table.projectID
                );
                ElMessage.success("修改项目成功！");
            } else {
                ElMessage.warning(res.msg);
            }
        });
    }
}

// 添加父表格
function addParentTable() {
    getProjectProgressList(null, props.workbenchDetailType).then((res: any) => {
        if (res.code == 200) {
            ElMessage.success("成功新建项目");
            const newId = parentTables.value.length + 1;
            const newTable = createParentTable(newId, "");
            newTable.saved = false;
            newTable.tasks = [...res.data];
            parentTables.value.push(newTable);

            // 切换到新添加的表格
            currentIndex.value = parentTables.value.length - 1;
            console.log("返回的项目进度为", res.data);
            updateAllConnectors();
        } else {
            ElMessage(res.msg);
        }
    });
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
function refreshProjectAllData(projectID: string, projectType: string) {
    // ...清空数据
    projectIDs.value.length = 0;
    projectProgress.value.length = 0;
    projectDetail.value.length = 0;
    projectRecord.value.length = 0;
    projectChangeList.value.length = 0;
    parentTables.value.splice(0, parentTables.value.length)
    let table = createParentTable(1, projectID);
    parentTables.value.push(table);
    const tableindex = parentTables.value.findIndex(
        (table: any) => table.projectID == projectID
    );
    refreshProgress(projectID || "", projectType);
    if (projectID) {
        refreshDetail(projectID);
    }
    const projectIdToUse = parentTables.value[tableindex].projectID || projectID;
    if (projectIdToUse) {
        refreshRecord(
            parentTables.value[tableindex].currentPage,
            parentTables.value[tableindex].pageSize,
            "start_time desc",
            projectIdToUse
        );
    }
    const changeProjectIdToUse = parentTables.value[tableindex].projectID || projectID;
    if (changeProjectIdToUse) {
        refreshChangeRecord(
            parentTables.value[tableindex].changeCurrentPage,
            parentTables.value[tableindex].changePageSize,
            "create_time desc",
            changeProjectIdToUse
        );
    }
}

//获取项目进度
function refreshProgress(projectID: string | null, projectType: string) {
    getProjectProgressList(projectID, projectType).then((res: any) => {
        if (res.code == 200) {
            const processedResData = res.data.map((element: any) => {
                if (element.finishTime == null) {
                    console.log("finish time为空");

                    return element;
                } else {
                    console.log("finish time为", element.finishTime);
                    return { ...element, finishTime: element.finishTime.slice(0, 16) };
                }
            });
            console.log("processedResDate", processedResData);

            const index = parentTables.value.findIndex(
                (table: any) => table.projectID == projectID
            );
            parentTables.value[index].tasks = [...processedResData];
            projectProgress.value.push(processedResData);
            // 添加任务流程自动居中调用
            nextTick(() => {
                centerActiveTaskInFlow(index);
            });
            // ElMessage.success('成功刷新项目进度')
        } else {
            ElMessage.warning("项目进度更新失败：" + res.msg);
        }
    });
}

//获取项目详情
function refreshDetail(projectID: string) {
    getProjectDetail(projectID).then((res: any) => {
        if (res.code == 200) {
            const index = parentTables.value.findIndex(
                (table: any) => table.projectID == projectID
            );
            //将元转换为万元
            const transformedData = computed(() => {
                const result = { ...res.data };
                ['acceptedContractMoney', 'budgetMoney', 'guaranteeMoney'].forEach(key => {
                    result[key] = result[key] / 10000;
                });
                return result;
            });
            parentTables.value[index].projectInfo = transformedData.value;
            projectDetail.value.push(transformedData.value);
            // ElMessage.success('成功刷新项目详情')
        } else ElMessage.warning(res.msg);
    });
}

//获取项目记录
function refreshRecord(
    pageNum: any,
    pageSize: any,
    orderBy: any,
    projectID: string | null
) {
    getProjectRecordList(pageNum, pageSize, orderBy, projectID).then(
        (res: any) => {
            if (res.code == 200) {
                // console.log('getRecord成功》》》》');
                // console.log(parentTables.value);

                let total = res.data.total;
                let record = res.data.list;
                console.log("返回的record--------------------", record);
                // record = record.map((element: any) => {
                //     if (element.startTime == null && element.endTime == null) {
                //         // console.log('finish time为空');
                //         return element;
                //     } else {
                //         // console.log('finish time为',element.finishTime);
                //         return {
                //             ...element,
                //             startTime: element.startTime.slice(0, 16),
                //             endTime: element.endTime.slice(0, 16),
                //         };
                //     }
                // });

                let pageNum = res.data.pageNum;
                let pageSize = res.data.pageSize;
                // console.log(total, record, pageNum, pageSize);

                let index = parentTables.value.findIndex((element: any) => {
                    return element.projectID == projectID;
                });

                parentTables.value[index].total = Number(total);
                parentTables.value[index].followRecords = [...record];
            } else {
                ElMessage.warning(res.msg);
            }
        }
    );
}

function refreshChangeRecord(
    pageNum: any,
    pageSize: any,
    orderBy: any,
    projectID: string | null
) {
    getChangeList(pageNum, pageSize, orderBy, projectID).then((res: any) => {
        if (res.code == 200) {
            // console.log('getRecord成功》》》》');
            // console.log(parentTables.value);

            let total = res.data.total;
            let record = res.data.list;
            let pageNum = res.data.pageNum;
            let pageSize = res.data.pageSize;
            // console.log(total, record, pageNum, pageSize);

            let index = parentTables.value.findIndex((element: any) => {
                return element.projectID == projectID;
            });

            parentTables.value[index].changeTotal = Number(total);
            parentTables.value[index].changeRecords = [...record];
        } else {
            ElMessage.warning(res.msg);
        }
    });
}
// 初始化连接线
onMounted(() => {
    console.log('PlaceInFileProjectDetail.vue组件初始化完成');
    // 获取当前用户信息
    // const userStr = localStorage.getItem("user");
    // if (userStr) {
    //     currentUser.value = JSON.parse(userStr);
    // }
    // console.log('路由组件中currentUser.value和props.workbenchDetailUserID分别为',currentUser.value, props.workbenchDetailUserID);
    refreshProjectAllData(props.workbenchDetailID, props.workbenchDetailType)
    getUnitTypes().then((res: any) => {
        if (res.code == 200) {
            projectTypes.value = [...res.data]
        } else {
            ElMessage.warning(res.msg)
        }
    })
    window.addEventListener('resize', updateAllConnectors);
});
</script>
<style scoped>
/* project-header 样式 */
.project-header {
    margin-bottom: 24px;
    font-size: 20px;
    display: flex;
    align-items: center;
    color: black;
}

.header-link {
    color: #7c68ee;
    text-decoration: none;
    cursor: pointer;
}

.project-name-label {
    margin: 0 10px;
    color: black;
}

.recovery-link {
    /* background-color: #7c68ee; */
    background-color: white !important;
    color: #333333;
    font-size: 20px;
    font-weight: 400;
    border: 1px solid #333333;
    border-radius: 4px;
    margin-left: auto;
    width: 140px;
    height: 40px;
    cursor: pointer;
}
</style>
<style scoped>
/* * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Helvetica Neue", Arial, sans-serif;
}

body {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
    min-height: 100vh;
    padding: 20px;
} */

.container {
    width: 1630px;
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
    background: #f6f8fe;
    margin-bottom: 24px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px dotted #7c68ee;
    border-radius: 4px;
}

.add-table-btn {
    /* border-width: 1px 1px 0px 1px;
    border-style: solid;
    border-color: #7C68EE;
    border-radius: 0; */
    border: none;
    color: #7c68ee;
    padding: 10px 50px;
    font-size: 20px;
    font-weight: 700;
    background: #f6f8fe;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.carousel-container {
    position: relative;
    overflow: hidden;
    margin-bottom: 30px;
    /* border-radius: 12px; */
    background: white;
    /* height: 1000px; */
    width: 100%;
}

.carousel-track {
    display: flex;
    transition: transform 0.5s ease-in-out;
    height: 100%;
    width: 100%;
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

    width: 140px;
    height: 40px;
    color: black;
    border-width: 1px;
    border-style: solid;
    border-color: black;
    border-radius: 4px;
    background: #e3e8ff;
    overflow: hidden;
}

.task-control :deep(.el-select .el-input--suffix) {
    height: 40px;
    border: none;
    box-shadow: none;

    padding: 0px;
}

.task-control :deep(.el-select .el-input__wrapper) {
    padding: 0px;
    margin-bottom: 2px;
    background: #e3e8ff;
    width: 140px;
}

.task-control :deep(.el-select .el-input__suffix) {
    position: relative;
    padding: 0;
    height: 16px;
    width: 16px;
    left: -20px;
    /* margin-left: 16px; */
}

.task-control :deep(.el-select .el-input__inner) {
    position: relative;
    height: 100%;
    border: none;
    color: black;
    font-size: 20px;
    text-align: center;
    font-weight: 400;
    width: 80px;
    left: -5px;
    /* margin-left: 14px; */
}

.task-control :deep(.el-select .el-input__inner::-webkit-input-placeholder) {
    color: black;
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
    background: #e3e8ff;
    /* border: 3px solid #d9cfff; */
    border-width: 1px 1px 0px 1px;
    border-style: solid;
    border-color: #7c68ee;
    border-radius: 0;
    /* 无圆角 */
    padding: 0 20px;
    height: 56px;
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
    justify-content: flex-end;
    width: 304px;
}

:deep(.el-button) {
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 0;
    /* 无圆角 */
    transition: all 0.2s;
}

.transfer-btn {
    width: 140px;
    height: 40px;
    color: black;
    border: 1px solid black;
    border-radius: 4px;
    font-size: 20px;
    font-weight: 400;

    /* &:hover {
        background: rgba(122, 90, 245, 0.08);
        color: #6a4ae0;
    } */
}

.more-actions .el-button {
    color: #7a5af5;

}

.dropdown-menu {
    border-radius: 0;
    /* 无圆角 */
    border: 1px solid #e0d6ff;

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
    border-width: 1px 1px 0px 1px;
    border-style: solid;
    border-color: #7c68ee;
    border-radius: 0;
    position: relative;
    min-height: 200px;
}

/* 任务流程样式 */
/* 任务流程样式 */
.task-flow {
    display: flex;
    /* justify-content: space-between; */
    /* gap: 50px; */
    flex-wrap: nowrap;
    overflow-x: auto;
    position: relative;
    padding: 15px 0;
    height: 150px;
    /* 减少高度以适应单行布局 */
    z-index: 0;
    scrollbar-width: thin;
    scrollbar-color: #7c68ee #f0f0f0;
}

/* 添加滚动条样式 */
.task-flow::-webkit-scrollbar {
    height: 6px;
}

.task-flow::-webkit-scrollbar-track {
    background: #f0f0f0;
}

.task-flow::-webkit-scrollbar-thumb {
    background-color: #7c68ee;
    border-radius: 3px;
}

/* 添加连接线样式 */
.connector-line {
    flex-grow: 1;
    height: 3px;
    width: 160px;
    background: #e0e0e0;
    position: absolute;
    top: .35rem;
    left: -80px;
    border-radius: 4px;
}

.connector-line.completed {
    background: #4CAF50;
}

.connector-line.active {
    background: #7c68ee;
}

.connector-line.paused {
    background: #bdc3c7;
}

/* 调整任务节点容器 */
.task-node-container {
    display: flex;
    align-items: center;
    position: relative;
    min-width: 200px;
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

/* .task-node {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
} */
.task-node {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
    /* 确保节点在连接线上方 */
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
    background: #4caf50;
    border-color: #4caf50;
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
    background-color: #7c68ee;
    border-radius: 25px;
    height: 25%;
    width: 50%;
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
    gap: 40px;
}

.pagination-button {
    width: 120px;
    height: 24px;
    border-radius: 4px;
    border-width: 1px;
    gap: 8px;
    angle: 0 deg;
    opacity: 1;
    border: 1px solid #7c68ee;
    background: #e3e8ff;
    color: #7c68ee;
    /* color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7C68EE; */
}

.pagination-button.active {
    background: #7c68ee;

    color: #ffffff;
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
    border-width: 1px 1px 0px 1px;
    border-style: solid;
    border-color: #7c68ee;
    border-radius: 0;

    height: 262px;
}

.input-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 1550px;
    gap: 24.5px 80px;
}

.input-item {
    /* display: flex;
    flex-direction: column;
    justify-items: center; */
    width: 320px;
}

.input-item label {
    font-size: 17px;
    color: #555;
    margin-bottom: 5px;
    font-weight: 500;
}

.input-area {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    border-width: 1px;
    angle: 0 deg;
    opacity: 1;
    background: #ffffff;
    /* border: 1px solid #7c68ee; */
}

/* 修复el-input样式 */
.input-area :deep(.el-input) {
    width: 100%;
}

.input-area :deep(.el-input .el-input__wrapper) {
    height: 40px;
    border-radius: 4px;
    border: none;
    background: #ffffff;
    border: 1px solid #7c68ee;
}

.input-area :deep(.el-input .el-input__inner) {
    height: 40px;
    border: none;
    background: transparent;
}

/* 修复el-select样式 */
.input-area :deep(.el-select) {
    width: 100%;
    height: 40px;
}

.input-area :deep(.el-select .el-input__wrapper) {
    height: 40px;
    border-radius: 4px;
    border: none;
    background: #ffffff;
    border: 1px solid #7c68ee;
}

.input-area :deep(.el-select .el-input__inner) {
    height: 40px;
    border: none;
    background: transparent;
}

/* 修复el-date-picker样式 */
.input-area :deep(.el-date-editor) {
    width: 100%;
    height: 40px;
}

.input-area :deep(.el-date-editor .el-input__wrapper) {
    height: 40px;
    border-radius: 4px;
    border: none;
    background: #ffffff;
    border: 1px solid #7c68ee;
}

.input-area :deep(.el-date-editor .el-input__inner) {
    height: 40px;
    border: none;
    background: transparent;
}

/* 确保下拉箭头正确显示 */
.input-area :deep(.el-select .el-input__suffix) {
    height: 40px;
}

.input-area :deep(.el-select .el-icon) {
    height: 40px;
    line-height: 40px;
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
    background: #e3e8ff;
    /* padding: 15px 20px; */
    border-bottom: 1px solid #7c68ee;
    font-size: 20px;
    font-weight: 400;
    color: black;
    text-align: center;
    padding: 10px 0;
    height: 48px;
}

.app-container {
    /* max-width: 1400px; */
    width: 100%;
    /* padding: 20px; */
}

.table-container {
    background-color: white;
    border-bottom-color: #7c68ee;
    border-bottom-width: 1px;
    border-bottom-style: solid;
}

.time-range {
    display: flex;
    justify-items: center;
    color: #5a3d9c;
    font-size: 16px;
    font-weight: 400px;
    height: 32px;
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
    /* background-color: #6a5af9; */
    width: 64;
    height: 23;
    angle: 0 deg;
    opacity: 1;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    vertical-align: middle;
    color: #7c68ee !important;
    border: none;
    padding: 8px 16px;
    /* border-radius: 4px; */
    transition: all 0.3s;
}

.footer-panel {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /* position: relative;
    left: 0; */
    margin-bottom: 8px;
    padding: 15px 0px;
    /* background-color: #f9f8ff; */
    height: 48px;
    border-top: 1px solid #e4e1ff;
    position: relative;
    /* margin-top: 63.5px; */
}

.footer-panel :deep(.el-select .el-input__wrapper) {
    padding-bottom: 4px;
}

.footer-panel :deep(.el-select .el-input__inner) {

    position: relative;
    height: 100%;
    border: none;
    color: black;
    font-size: 16px;
    text-align: center;
    font-weight: 400;
    top: 1px;
    width: 40px;
    height: 25px;
    left: -5px;
    z-index: 0;
    /* margin-left: 14px; */
}

:deep(.el-pager li.is-active, .el-pager li:hover) {
    color: #7c68ee !important;
    font-size: 16px !important;
    border: 1px solid #7c68ee;
    border-radius: 4px;
}

.add-btn {
    float: left;
    position: relative;
    border: 1px solid #7c68ee;
    color: #7c68ee;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.3s;
    width: 120px;
    height: 32px;
    left: 0;
    font-size: 16px;
}

.rmv-btn {
    /* background-color: #6a5af9; */
    /* background: #7C68EE; */
    float: left;
    position: relative;
    border: 1px solid #aaaaaa;
    color: #aaaaaa;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.3s;
    width: 120px;
    height: 32px;
    left: 40px;
}

.record-page-panel {
    /* position: absolute;
    width: 200px;
    height: 32px; */
    /* left: 30px; */
    /* float: right; */
    /* margin-right: 0px; */
    /* gap: 24px; */
    /* angle: 0 deg;
    opacity: 1;
    right: 150px; */
    margin-left: auto;
    padding-right: 24px;
}

/* .change-page-select {

    width: 120px;
    height: 32px;
    margin-right: 24px;
    color: black;
    border-width: 1px;
    border-style: solid;
    border-color: black;
    border-radius: 4px;
    background: white;
    overflow: hidden;
}

.change-page-select :deep(.el-select .el-input--suffix) {
    height: 32px;
    border: none;
    box-shadow: none;

    padding: 0px;
}

.change-page-select :deep(.el-select .el-input__wrapper) {
    padding: 0px;
    margin-bottom: 2px;
    background: white;
    width: 120px;
}

.change-page-select :deep(.el-select .el-input__suffix) {
    position: relative;
    padding: 0;
    height: 16px;
    width: 16px;
    left: -20px;
}

.change-page-select :deep(.el-select .el-input__inner) {
    position: relative;
    height: 100%;
    border: none;
    color: black;
    font-size: 16px;
    text-align: center;
    font-weight: 400;
    width: 80px;
    left: -5px;
}

.change-page-select :deep(.el-select .el-input__inner::-webkit-input-placeholder) {
    color: black;
} */

.record-save-btn {
    position: relative;
    /* right: -195px; */
    width: 140px;
    height: 40px;
    /* margin-left: 400px; */
    /* left: 465px; */
    color: white;
    border: 1px solid #7c68ee;
    border-radius: 4px;
    background: #7c68ee;
    font-size: 18px;
}

.dialog-header {
    background-color: #6a5af9;
    color: white;
    padding: 15px 20px;
    /* border-radius: 8px 8px 0 0; */
    font-size: 50px;
    font-weight: 600;
}

.error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
}

.coordination-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    position: relative;
    /* top: 40px; */
    /* padding: 15px 0; */
    /* border-top: 1px solid #eee; */
}

.action-buttons {
    /* display: flex;
  gap: 12px; */
    width: 400px;

}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}

.deliver-form .dialog-footer {
    display: flex;
    justify-content: center;
}

.cancel-btn {
    position: relative;
    /* right: -195px; */
    width: 140px;
    height: 40px;
    /* left: 450px; */
    border: 1px solid black;
    border-radius: 4px;
    font-size: 18px;
}

/* 变更记录表格 */
.change-record-section {
    min-height: 260px;
    /* padding: 20px 25px; */
    /* margin-top: 50px; */
    border-width: 1px 1px 1px 1px;
    border-style: solid;
    border-color: #7c68ee;
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

/* 新增表格单元格通用样式 */
.child-table-section {
    /* min-height: 240px; */
    /* padding: 20px 25px; */
    /* display: flex; */
    border-width: 1px 1px 0px 1px;
    border-style: solid;
    border-color: #7c68ee;
    border-radius: 0;
}

.child-table-section>>>.el-table th,
.child-table-section>>>.el-table td,
.change-record-section>>>.el-table th,
.change-record-section>>>.el-table td {
    height: 48px !important;
    background: #ffffff !important;
    border-width: 0px 1px 1px 0px !important;
    border-style: solid !important;
    border-color: #7c68ee !important;
    text-align: center;
}

/* 跟进记录表 - 列宽调整 */


/* .child-table-section>>>.el-table td:nth-child(1) {
    width: 299px !important;
    text-align: left !important;
}

.child-table-section>>>.el-table th:nth-child(2),
.child-table-section>>>.el-table td:nth-child(2) {
    width: 438px !important;
}

.child-table-section>>>.el-table th:nth-child(3),
.child-table-section>>>.el-table td:nth-child(3) {
    width: 398px !important;
}

.child-table-section>>>.el-table th:nth-child(4),
.child-table-section>>>.el-table td:nth-child(4) {
    width: 315px !important;
} */

.child-table-section>>>.el-table th:nth-child(5),
.child-table-section>>>.el-table td:nth-child(5) {
    width: 180px !important;
    border-width: 0px 0px 1px 0px !important;
}

/* 变更记录表 - 列宽调整 */
/* .change-record-section>>>.el-table th:nth-child(1),
.change-record-section>>>.el-table td:nth-child(1) {
    width: 299px !important;
}

.change-record-section>>>.el-table th:nth-child(2),
.change-record-section>>>.el-table td:nth-child(2) {
    width: 180px !important;
}

.change-record-section>>>.el-table th:nth-child(3),
.change-record-section>>>.el-table td:nth-child(3) {
    width: 180px !important;
} */

.change-record-section>>>.el-table th:nth-child(4),
.change-record-section>>>.el-table td:nth-child(4) {
    width: 971px !important;
    border-width: 0px 0px 1px 0px !important;
}

.record-input-area {
    width: 100%;
    /* margin-bottom: 60px; */
}

/* 新增记录对话框样式 */
/* 修复el-date-editor样式 */
/* .record-input-area :deep(.el-date-editor) {
  width: 100%;
  height: 40px;
}

.record-input-area :deep(.el-date-editor .el-input__wrapper) {
  height: 40px;
  border-radius: 4px;
  border: none;
  background: #ffffff;
  border: 1px solid #7c68ee;
}

.record-input-area :deep(.el-date-editor .el-input__inner) {
  height: 40px;
  border: none;
  background: transparent;
} */
/* 统一输入组件样式 */
.record-input-area :deep(.el-input__wrapper),
.record-input-area :deep(.el-textarea__inner) {
    border: 1px solid #7c68ee;
    border-radius: 4px;
    width: 100%;
    /* height: 96px; */
    /* margin-bottom: 24px; */
}

/* 移除固定宽度 */
.record-input-area :deep(.el-date-editor) {
    width: 100%;
}

/* 统一标签样式 */
:deep(.el-dialog__header) {
    background: #e3e8ff;
    border: 8px solid #e3e8ff;
    color: black;
    padding: 15px 20px;
    margin: 0;
    border-radius: 8px;
}

.rounded-dialog {

    /* 作用于对话框主体 */
    :deep(.el-dialog) {
        border-radius: 8px !important;
        overflow: hidden;
        height: min-400px !important;
        /* 可选：增强视觉效果 */
    }

    /* 对话框头部圆角 */
    :deep(.el-dialog__header) {
        border-top-left-radius: 80px;
        border-top-right-radius: 800px;
        background: #e3e8ff;
        /* 保持原有背景色 */
        margin-right: 0;
        /* 移除默认右边距 */
    }

    /* 对话框内容区域圆角 */
    :deep(.el-dialog__body) {
        border-bottom-left-radius: 80px;
        border-bottom-right-radius: 80px;
        padding: 20px;
        /* 保持原有内边距 */
    }

    /* 协调管理表格特殊处理 */
    &.coordination-dialog :deep(.el-dialog__body) {
        padding: 0 20px 20px;
        /* 底部留白 */
    }
}

.form-container label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 18px;
    color: #555;
}

/* 修复协调管理表格边框样式 */
.coordination-table {
    border: 1px solid #7c68ee !important;
    min-height: 80px;
    /* padding-bottom: 24px; */
}

.coordination-table :deep(.el-table__header th) {
    background-color: #e3e8ff !important;
    border-bottom: 1px solid #7c68ee !important;
    border-right: 1px solid #7c68ee !important;
}

.coordination-table :deep(.el-table__row td) {
    border-bottom: 1px solid #7c68ee !important;
    border-right: 1px solid #7c68ee !important;
}

/* 移除最后一列的右边框 */
.coordination-table :deep(.el-table__header th:last-child),
.coordination-table :deep(.el-table__row td:last-child) {
    border-right: none !important;
}

/* 时间范围列样式优化 */
/* .time-range {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px;
} */

/* 新增协调记录样式 */
.new-coordination-form :deep(.el-input__wrapper),
.new-coordination-form :deep(.el-textarea__inner) {
    border: 1px solid #7c68ee !important;
    border-radius: 4px;

}

.new-coordination-form label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
}

/* 项目转交对话框样式 */
.deliver-form :deep(.el-select) {
    border-radius: 4px;
    width: 460px !important;
    height: 40px !important;
}

.deliver-form :deep(.el-input__wrapper) {
    border: 1px solid #7c68ee !important;
    border-radius: 4px;
    width: 60px !important;
    height: 40px !important;
    padding: 0px !important;
}

.deliver-form .low-opacity :deep(.el-input__wrapper) {
    opacity: 0.3;
}

.deliver-form label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
}

/* 页码样式 */
:deep(.el-pagination.is-background .el-pager li) {
    color: black;
    /* 未选中页码字体颜色 */
    /* border: 1px solid black; */
    background-color: transparent;
    /* 未选中页码背景透明 */
    border-radius: .04rem;
}

/* 选中页码样式 */
:deep(.el-pagination.is-background .el-pager li.is-active) {
    color: #7c68ee !important;
    /* 选中页码字体颜色 */
    border: 1px solid #7c68ee !important;
    /* 选中页码边框颜色 */
    background-color: white !important;
    /* 选中页码背景白色 */
}

/* 上一页/下一页按钮样式 */
:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .btn-next) {
    color: black;
    /* 按钮字体颜色 */
    /* border: 1px solid black; */
    background-color: transparent;
    /* 按钮背景透明 */
    border-radius: 4px;
}

/* 禁用按钮样式 */
:deep(.el-pagination.is-background .btn-prev:disabled),
:deep(.el-pagination.is-background .btn-next:disabled) {
    color: #c0c4cc;
    /* 禁用按钮字体颜色 */
    border-color: #c0c4cc;
    /* 禁用按钮边框颜色 */
}

/* 所有下拉菜单项文字居中 */
.el-select-dropdown__item {
    text-align: center !important;
    font-size: 17px;
}

/* 下拉菜单悬停效果 */
.el-select-dropdown__item:hover {
    background-color: #7c68ee !important;
    color: white !important;
}

/* 未悬停菜单项背景色 */
.el-select-dropdown__item {
    background-color: white !important;
}
</style>
<style lang="css" scoped>

/* edge浏览器 */
.change-page-select :deep(.el-select__wrapper) {
    border: 1px solid #333333;
    height: 32px;
    width: 120px;
    box-shadow: none;
    margin-right: 24px;
}

.change-page-select :deep(.el-select__placeholder) {
    color: #333333;
    font-size: 16px;
    font-weight: 400;
}

/* 谷歌浏览器 */

.change-page-select :deep(.el-input__wrapper) {
    border: 1px solid #333333;
    height: 26px;
    width: .98rem;
    margin-right: 24px;
    box-shadow: none;
}

.change-page-select :deep(.el-input__inner) {
    color: #333333;
    font-size: 16px;
    font-weight: 400;
}

/* .change-page-select :deep(.el-select__wrapper) {
  border: 1px solid #333333;
  height: 32px;
  width: 120px;
  margin-right: 24px;
}

.change-page-select :deep(.el-select__placeholder) {
  color: #333333 !important;
  font-size: 16px !important;
  font-weight: 400;
} */

.el-dialog {
    border-radius: 8px !important;
}

.el-dialog__header {
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
}

.el-dialog__body {
    min-height: 150px;
    padding-bottom: 24px;
}
</style>
<style lang="css">
.el-popper {
    max-width: 500px !important;
    /* 调整为你需要的最大宽度 */
}
</style>
