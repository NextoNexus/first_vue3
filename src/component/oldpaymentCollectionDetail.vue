<template>
    <!-- 输入区域部分 -->
    <div class="input-section">
        <div class="input-grid">
            <div class="input-item">
                <div class="input-label">
                    <label><span class="required-mark">*</span>单位名称</label>
                    <div v-if="validationStatus.unitName.isError" class="error-message">{{ validationStatus.unitName.message }}</div>

                </div>
                <div class="input-area" :class="{ 'error-border': validationStatus.unitName.isError }">
                    <el-input v-model="props.table.projectInfo.unitName" size="medium"
                        :disabled="isOwner != undefined && !isOwner" @input="validateChineseEnglishInput($event, 'unitName')"></el-input>
                </div>
            </div>
            <div class="input-item">
                <div class="input-label">
                    <label><span class="required-mark">*</span>类别：</label>
                    <div v-if="validationStatus.unitType.isError" class="error-message">{{ validationStatus.unitType.message }}</div>
                </div>
                <div class="input-area" :class="{ 'error-border': validationStatus.unitType.isError }">
                    <el-select v-model="props.table.projectInfo.unitType" size="medium"
                        :disabled="isOwner != undefined && !isOwner" :suffix-icon="SelectIcon">
                        <el-option v-for="item in props.projectTypes" :key="item.enumKey" :label="item.enumName"
                            :value="item.enumKey">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="input-item">
                <div class="input-label">
                    <label><span class="required-mark">*</span>项目名称：</label>
                    <div v-if="validationStatus.projectName.isError" class="error-message">{{ validationStatus.projectName.message }}</div>
                    
                </div>
                <div class="input-area" :class="{ 'error-border': validationStatus.projectName.isError }">
                    <el-input v-model="props.table.projectInfo.projectName" size="medium"
                        :disabled="isOwner != undefined && !isOwner" @input="validateChineseEnglishInput($event, 'projectName')"></el-input>
                </div>
            </div>
            <div class="input-item">
                <div class="input-label">
                    <label><span class="required-mark">*</span>项目负责人(A/B)：</label>
                    <div v-if="validationStatus.commander.isError" class="error-message">{{ validationStatus.commander.message }}</div>
                    
                </div>
                <div class="input-area" :class="{ 'error-border': validationStatus.commander.isError }">
                    <el-input v-model="props.table.projectInfo.commander" size="medium"
                        :disabled="isOwner != undefined && !isOwner" @input="validateChineseEnglishInput($event, 'commander')"></el-input>
                </div>
            </div>
            <div class="input-item">
                <div class="input-label">
                    <label><span class="required-mark">*</span>中标合同金额（万元）：</label>
                    
                    <div v-if="validationStatus.acceptedContractMoney.isError" class="error-message">{{ validationStatus.acceptedContractMoney.message }}</div>
                </div>
                <div class="input-area" :class="{ 'error-border': validationStatus.acceptedContractMoney.isError }">
                    <el-input v-model="props.table.projectInfo.acceptedContractMoney" size="medium" type="number"
                        :min="0"
                        @keydown="(e: any) => handleMoneyInput(e, props.table.projectInfo.acceptedContractMoney)"
                        :disabled="isOwner != undefined && !isOwner">
                    </el-input>
                </div>
            </div>
            <div class="input-item">
                <div class="input-label">
                    <label><span class="required-mark">*</span>质保年限：</label>
                    <div v-if="validationStatus.guaranteePeriod.isError" class="error-message">{{ validationStatus.guaranteePeriod.message }}</div>
                    
                </div>
                <div class="input-area" :class="{ 'error-border': validationStatus.guaranteePeriod.isError }">
                    <el-input v-model="props.table.projectInfo.guaranteePeriod" size="medium" type="number" :min="0"
                        :disabled="isOwner != undefined && !isOwner"
                        @keydown="(e: any) => handleMoneyInput(e, props.table.projectInfo.guaranteePeriod)">
                    </el-input>
                </div>
            </div>
            <div class="input-item">
                <div class="input-label">
                    <label><span class="required-mark">*</span>付款方案：</label>
                    
                    <div v-if="validationStatus.payType.isError" class="error-message">{{ validationStatus.payType.message }}</div>
                </div>
                <div class="input-area" :class="{ 'error-border': validationStatus.payType.isError }">
                    <el-select v-model="props.table.projectInfo.payType" size="medium"
                        :disabled="isOwner != undefined && !isOwner" :suffix-icon="SelectIcon">
                        <el-option label="全款" value="全款"></el-option>
                        <el-option label="分期" value="分期"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="input-item">
                <label>预付款：</label>
                <div class="input-area">
                    <el-input v-model="props.table.projectInfo.preMoney" size="medium" type="number" :min="0"
                        @keydown="(e: any) => handleMoneyInput(e, props.table.projectInfo.preMoney)"
                        :disabled="isOwner != undefined && !isOwner">
                    </el-input>
                </div>
            </div>
            <div class="input-item">
                <label>进度款：</label>
                <div class="input-area">
                    <el-input v-model="props.table.projectInfo.progressMoney" size="medium" type="number" :min="0"
                        @keydown="(e: any) => handleMoneyInput(e, props.table.projectInfo.progressMoney)"
                        :disabled="isOwner != undefined && !isOwner">
                    </el-input>
                </div>
            </div>
            <div class="input-item">
                <label>是否验收：</label>
                <div class="input-area">
                    <el-select v-model="props.table.projectInfo.checkFlag" size="medium"
                        :disabled="isOwner != undefined && !isOwner" :suffix-icon="SelectIcon">
                        <el-option label="是" value="是"></el-option>
                        <el-option label="否" value="否"></el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="button-container">
            <el-button class="save-btn" @click="saveProject(props.table)"
                :disabled="isOwner == undefined || !isOwner || props.table.projectInfo.status == 'PAUSE'">
                保存
            </el-button>
        </div>
    </div>

</template>

<script setup lang="ts">
import SelectIcon from './components/icon/select/SelectIcon.vue';
import { ElMessage } from 'element-plus';
import { reactive } from 'vue';

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
        isOwner?: boolean,
        table: any,
        projectTypes: any
    }>(),
    {}
);

const emit = defineEmits<{
    (e: 'saveProjectEvent', table: any): void
}>();

//输入数据校验
// 新增校验方法：限制只能输入中英文，且最大长度10
const validateChineseEnglishInput = (value: string, field: string) => {
  // 移除非中英文字符（保留中文字符和英文字母）
  let filteredValue = value.replace(/[^\u4e00-\u9fa5a-zA-Z/\\]/g, '');
  
  // 截取前10个字符
  if (filteredValue.length > 15) {
    filteredValue = filteredValue.substring(0, 15);
  }
  
  // 更新对应字段的值
  props.table.projectInfo[field] = filteredValue;
};

// 添加字段映射
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
    // 重置所有验证状态
    Object.keys(validationStatus).forEach(key => {
        validationStatus[key].isError = false;
        validationStatus[key].message = '';
    });
    console.log('在子组件中点击了保存');
    console.log('项目详情为：：：', table.projectInfo);


    // 必填字段列表
    const requiredFields = [
        'unitName',
        'unitType',
        'projectName',
        'commander',
        'acceptedContractMoney',
        'guaranteePeriod',
        'payType'
    ];

    // 收集未填写的必填项
    const missingFields: string[] = [];

    requiredFields.forEach(field => {
        const value = table.projectInfo[field];
        // 检查是否为空值
        if (
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim() === '')
        ) {
            missingFields.push(field);
            // 设置验证状态为错误
            validationStatus[field].isError = true;
            validationStatus[field].message = '必填项';
        }
    });

    // 如果有未填写的必填项
    if (missingFields.length > 0) {
        // 生成中文提示信息
        const chineseNames = missingFields.map(field => fieldNameMap[field] || field);
        ElMessage.error(`请填写以下必填项: ${chineseNames.join(', ')}`);
        return; // 阻止保存操作
    }

    // 项目负责人格式校验
    const commander = table.projectInfo.commander;
    const commanderPattern = /^[\u4e00-\u9fa5a-zA-Z]+(\/[\u4e00-\u9fa5a-zA-Z]+)?$/;

    if (!commanderPattern.test(commander)) {
        ElMessage.error('请输入正确的项目负责人格式：中英文名字 或 名字1/名字2');
        return; // 阻止保存操作
    }

    // 通过校验后触发保存事件
    emit('saveProjectEvent', table);
}

// 输入金额限制
const handleMoneyInput = (e: KeyboardEvent, value: any) => {
    const allowedKeys = [
        "Backspace",
        "Tab",
        "Enter",
        "Escape",
        "ArrowLeft",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown",
        "Delete",
    ];
    if (allowedKeys.includes(e.key)) return;

    // 当前输入框的值
    const currentValue = value
    // 输入的字符
    const inputChar = e.key;

    // 过滤非数字和非小数点
    if (!/[0-9.]/.test(inputChar)) {
        e.preventDefault();
        return;
    }

    // 禁止多个小数点
    if (inputChar === "." && currentValue.includes(".")) {
        e.preventDefault();
        return;
    }

    // 去掉小数点后的长度
    const currentLength = currentValue.replace(/\./g, "").length;

    // 如果输入的是数字且总长度已达7位，则阻止输入
    if (inputChar !== "." && currentLength >= 7) {
        e.preventDefault();
        return;
    }

    // 避免多个0开头
    if (currentValue === "0" && inputChar !== "." && currentValue.length === 1) {
        e.preventDefault();
    }
};
</script>

<style scoped>
/* 按钮容器 */
.button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
    width: 100%;
}

/* 添加星号样式 */
.required-mark {
    color: red;
    margin-right: 4px;
}

.input-section {
    padding: 15px 55px 15px 55px !important;
    border-width: 1px 1px 0px 1px;
    border-style: solid;
    border-color: #7c68ee;
    border-radius: 0;

    height: 262px;
}

.input-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    width: 100%;
    height: 164px;
    gap: 24.5px 80px;
}

.input-item {
    /* display: flex;
    flex-direction: column;
    justify-items: center; */
    width: 240px;
}

.input-item label {
    font-size: 17px;
    color: #555;
    font-weight: 500;
}

.input-label{
    display: flex;
    justify-content: space-between;
}

/* 错误边框样式 */
.error-border :deep(.el-input__wrapper),
.error-border :deep(.el-select .el-input__wrapper),
.error-border :deep(.el-date-editor .el-input__wrapper) {
  border-color: red !important;
}

/* 错误信息样式 */
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 4px;
}

.save-btn {
    width: 140px;
    height: 40px;
    color: white;
    border: 1px solid #7c68ee;
    border-radius: 4px !important;
    background: #7c68ee;
}
</style>

<style scoped>
/* edge浏览器 */
:deep(.el-select__wrapper) {
  border: 1px solid #7c68ee;
  height: 40px;
  box-shadow: none;
}
/* 谷歌浏览器 */
:deep(.el-input__wrapper) {
  border: 1px solid #7c68ee;
  height: 40px;
  box-shadow: none;
  font-size: 18px;
  font-weight: 400;
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
