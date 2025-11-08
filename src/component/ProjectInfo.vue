<template>
    <!-- 对话框组件 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" :before-close="handleClose"
        custom-class="project-dialog">
        <!-- 输入区域部分 -->
        <div class="input-section">
            <div class="input-grid">
                <!-- 左侧列 -->
                <div class="input-column">
                    <div class="input-item">
                        <div class="input-label">
                            <label><span class="required-mark">*</span>单位名称</label>
                            <div v-if="validationStatus.unitName.isError" class="error-message">{{
                                validationStatus.unitName.message }}</div>
                        </div>
                        <div class="input-area" :class="{ 'error-border': validationStatus.unitName.isError }">
                            <el-input v-model="props.table.projectInfo.unitName" size="medium"
                                :disabled="isOwner != undefined && !isOwner"
                                @input="validateChineseEnglishInput($event, 'unitName')"
                                placeholder="请输入单位名称"></el-input>
                        </div>
                    </div>

                    <div class="input-item">
                        <div class="input-label">
                            <label><span class="required-mark">*</span>项目名称：</label>
                            <div v-if="validationStatus.projectName.isError" class="error-message">{{
                                validationStatus.projectName.message }}</div>
                        </div>
                        <div class="input-area" :class="{ 'error-border': validationStatus.projectName.isError }">
                            <el-input v-model="props.table.projectInfo.projectName" size="medium"
                                :disabled="isOwner != undefined && !isOwner"
                                @input="validateChineseEnglishInput($event, 'projectName')"
                                placeholder="请输入项目名称"></el-input>
                        </div>
                    </div>

                    <div class="input-item">
                        <div class="input-label">
                            <label><span class="required-mark">*</span>中标合同金额（万元）：</label>
                            <div v-if="validationStatus.acceptedContractMoney.isError" class="error-message">{{
                                validationStatus.acceptedContractMoney.message }}</div>
                        </div>
                        <div class="input-area"
                            :class="{ 'error-border': validationStatus.acceptedContractMoney.isError }">
                            <el-input v-model="props.table.projectInfo.acceptedContractMoney" size="medium"
                                type="number" :min="0"
                                @keydown="(e: any) => handleMoneyInput(e, props.table.projectInfo.acceptedContractMoney)"
                                :disabled="isOwner != undefined && !isOwner" placeholder="请输入金额">
                            </el-input>
                        </div>
                    </div>

                    <div class="input-item">
                        <div class="input-label">
                            <label><span class="required-mark">*</span>质保年限：</label>
                            <div v-if="validationStatus.guaranteePeriod.isError" class="error-message">{{
                                validationStatus.guaranteePeriod.message }}</div>
                        </div>
                        <div class="input-area" :class="{ 'error-border': validationStatus.guaranteePeriod.isError }">
                            <el-input v-model="props.table.projectInfo.guaranteePeriod" size="medium" type="number"
                                :min="0" :disabled="isOwner != undefined && !isOwner"
                                @keydown="(e: any) => handleMoneyInput(e, props.table.projectInfo.guaranteePeriod)"
                                placeholder="请输入年限">
                            </el-input>
                        </div>
                    </div>

                    <div class="input-item">
                        <label>预付款：</label>
                        <div class="input-area">
                            <el-input v-model="props.table.projectInfo.preMoney" size="medium" type="number" :min="0"
                                @keydown="(e: any) => handleMoneyInput(e, props.table.projectInfo.preMoney)"
                                :disabled="isOwner != undefined && !isOwner" placeholder="请输入金额">
                            </el-input>
                        </div>
                    </div>
                </div>

                <!-- 右侧列 -->
                <div class="input-column">
                    <div class="input-item">
                        <div class="input-label">
                            <label><span class="required-mark">*</span>类别：</label>
                            <div v-if="validationStatus.unitType.isError" class="error-message">{{
                                validationStatus.unitType.message }}</div>
                        </div>
                        <div class="input-area" :class="{ 'error-border': validationStatus.unitType.isError }">
                            <el-select v-model="props.table.projectInfo.unitType" size="medium"
                                :disabled="isOwner != undefined && !isOwner" :suffix-icon="SelectIcon"
                                placeholder="请选择类别">
                                <el-option v-for="item in props.projectTypes" :key="item.enumKey" :label="item.enumName"
                                    :value="item.enumKey"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="input-item">
                        <div class="input-label">
                            <label><span class="required-mark">*</span>项目负责人(A/B)：</label>
                            <div v-if="validationStatus.commander.isError" class="error-message">{{
                                validationStatus.commander.message }}</div>
                        </div>
                        <div class="input-area" :class="{ 'error-border': validationStatus.commander.isError }">
                            <el-input v-model="props.table.projectInfo.commander" size="medium"
                                :disabled="isOwner != undefined && !isOwner"
                                @input="validateChineseEnglishInput($event, 'commander')"
                                placeholder="格式：姓名 或 姓名A/姓名B"></el-input>
                        </div>
                    </div>

                    <div class="input-item">
                        <div class="input-label">
                            <label><span class="required-mark">*</span>付款方案：</label>
                            <div v-if="validationStatus.payType.isError" class="error-message">{{
                                validationStatus.payType.message }}</div>
                        </div>
                        <div class="input-area" :class="{ 'error-border': validationStatus.payType.isError }">
                            <el-select v-model="props.table.projectInfo.payType" size="medium"
                                :disabled="isOwner != undefined && !isOwner" :suffix-icon="SelectIcon"
                                placeholder="请选择付款方案">
                                <el-option label="全款" value="全款"></el-option>
                                <el-option label="分期" value="分期"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="input-item">
                        <label>进度款：</label>
                        <div class="input-area">
                            <el-input v-model="props.table.projectInfo.progressMoney" size="medium" type="number"
                                :min="0"
                                @keydown="(e: any) => handleMoneyInput(e, props.table.projectInfo.progressMoney)"
                                :disabled="isOwner != undefined && !isOwner" placeholder="请输入金额">
                            </el-input>
                        </div>
                    </div>

                    <div class="input-item">
                        <label>是否验收：</label>
                        <div class="input-area">
                            <el-select v-model="props.table.projectInfo.checkFlag" size="medium"
                                :disabled="isOwner != undefined && !isOwner" :suffix-icon="SelectIcon"
                                placeholder="请选择验收状态">
                                <el-option label="是" value="是"></el-option>
                                <el-option label="否" value="否"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="button-container">
                <el-button class="cancel-btn" @click="dialogVisible = false">取消</el-button>
                <el-button class="save-btn" type="primary" @click="saveProject(props.table)"
                    :disabled="isOwner == undefined || !isOwner || props.table.projectInfo.status == 'PAUSE'">
                    保存
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import SelectIcon from './icon/SelectDownIcon.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 对话框显示状态
const dialogVisible = ref(false);
const open = () => dialogVisible.value = true;
const close = () => dialogVisible.value = false;

// 对话框标题
const dialogTitle = computed(() => {
    return props.table.projectInfo.id ? '编辑项目信息' : '新增项目信息';
});

// 添加验证状态跟踪
const validationStatus: any = reactive({
    unitName: { isError: false, message: '' },
    unitType: { isError: false, message: '' },
    projectName: { isError: false, message: '' },
    commander: { isError: false, message: '' },
    acceptedContractMoney: { isError: false, message: '' },
    guaranteePeriod: { isError: false, message: '' },
    payType: { isError: false, message: '' }
});

const props = withDefaults(
    defineProps<{
        isOwner?: any,
        table: any,
        projectTypes: any
    }>(),
    {}
);

const emit = defineEmits<{
    (e: 'saveProjectEvent', table: any): void
}>();

// 暴露打开对话框的方法
defineExpose({ open, close });

// 对话框关闭前的处理
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('确定要关闭对话框吗？未保存的内容将会丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        done();
    }).catch(() => { });
};

//输入数据校验
const validateChineseEnglishInput = (value: string, field: string) => {
    let filteredValue = value.replace(/[^\u4e00-\u9fa5a-zA-Z/\\]/g, '');
    if (filteredValue.length > 15) {
        filteredValue = filteredValue.substring(0, 15);
    }
    props.table.projectInfo[field] = filteredValue;
};

// 字段映射
const fieldNameMap: Record<string, string> = {
    unitName: '单位名称',
    unitType: '类别',
    projectName: '项目名称',
    commander: '项目负责人(A/B)',
    acceptedContractMoney: '中标合同金额',
    guaranteePeriod: '质保年限',
    payType: '付款方案'
};

function saveProject(table: any) {
    // 重置验证状态
    Object.keys(validationStatus).forEach(key => {
        validationStatus[key].isError = false;
        validationStatus[key].message = '';
    });

    // 必填字段校验
    const requiredFields = [
        'unitName', 'unitType', 'projectName', 'commander',
        'acceptedContractMoney', 'guaranteePeriod', 'payType'
    ];

    const missingFields: string[] = [];

    requiredFields.forEach(field => {
        const value = table.projectInfo[field];
        if (value === undefined || value === null ||
            (typeof value === 'string' && value.trim() === '')) {
            missingFields.push(field);
            validationStatus[field].isError = true;
            validationStatus[field].message = '必填项';
        }
    });

    if (missingFields.length > 0) {
        const chineseNames = missingFields.map(field => fieldNameMap[field] || field);
        ElMessage.error(`请填写以下必填项: ${chineseNames.join(', ')}`);
        return;
    }

    // 项目负责人格式校验
    const commanderPattern = /^[\u4e00-\u9fa5a-zA-Z]+(\/[\u4e00-\u9fa5a-zA-Z]+)?$/;
    if (!commanderPattern.test(table.projectInfo.commander)) {
        validationStatus.commander.isError = true;
        validationStatus.commander.message = '格式：中文/英文 或 姓名A/姓名B';
        ElMessage.error('请输入正确的项目负责人格式：中英文名字 或 名字1/名字2');
        return;
    }

    // 保存成功后关闭对话框
    emit('saveProjectEvent', table);
    dialogVisible.value = false;
    ElMessage.success('项目信息保存成功');
}

// 金额输入限制
const handleMoneyInput = (e: KeyboardEvent, value: any) => {
    const allowedKeys = ["Backspace", "Tab", "Enter", "Escape", "ArrowLeft",
        "ArrowUp", "ArrowRight", "ArrowDown", "Delete"];
    if (allowedKeys.includes(e.key)) return;

    if (!/[0-9.]/.test(e.key)) {
        e.preventDefault();
        return;
    }

    if (e.key === "." && value?.includes?.(".")) {
        e.preventDefault();
        return;
    }

    const currentValue = String(value || '');
    const currentLength = currentValue.replace(/\./g, "").length;

    if (e.key !== "." && currentLength >= 7) {
        e.preventDefault();
        return;
    }

    if (currentValue === "0" && e.key !== "." && currentValue.length === 1) {
        e.preventDefault();
    }
};
</script>

<style scoped>
/* 对话框样式 */
:deep(.project-dialog) {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.project-dialog .el-dialog__header) {
    padding: 20px;
    border-bottom: 1px solid #eee;
    margin-right: 0;
}

:deep(.project-dialog .el-dialog__title) {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

:deep(.project-dialog .el-dialog__body) {
    padding: 20px 30px;
}

.input-section {
    padding: 0;
}

/* 两列网格布局 */
.input-grid {
    display: flex;
    gap: 30px;
    margin-bottom: 20px;
}

.input-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.input-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.input-label label {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
}

.input-area {
    width: 100%;
}

/* 按钮容器 */
.button-container {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    margin-top: 15px;
}

.save-btn {
    min-width: 100px;
    background: #7c68ee;
    border-color: #7c68ee;
    color: white;
}

.cancel-btn {
    min-width: 100px;
}

/* 错误提示 */
.required-mark {
    color: #f56c6c;
    margin-right: 4px;
}

.error-message {
    color: #f56c6c;
    font-size: 12px;
}

.error-border :deep(.el-input__wrapper),
.error-border :deep(.el-select .el-input__wrapper) {
    border-color: #f56c6c !important;
}
</style>

<style>
/* 全局调整下拉框样式 */
.project-dialog .el-select {
    width: 100%;
}

.project-dialog .el-input__wrapper {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    height: 40px;
    box-shadow: none;
}

.project-dialog .el-input__wrapper:hover {
    border-color: #c0c4cc;
}

.project-dialog .el-input__wrapper:focus-within {
    border-color: #7c68ee;
    box-shadow: 0 0 0 2px rgba(124, 104, 238, 0.2);
}

.project-dialog .el-select .el-input.is-focus .el-input__wrapper {
    box-shadow: 0 0 0 2px rgba(124, 104, 238, 0.2);
}
</style>