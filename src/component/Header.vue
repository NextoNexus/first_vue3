<template>
    <!-- 员工名字 -->
    <div class="header">
        <p class="title">
            <span class="username">XXX</span>的工作计划
        </p>
    </div>
    <!-- 搜索框和新建项目 -->
    <div class="search-header">
        <!-- 项目搜索 -->
        <div class="search-container">
            <el-input class="search-input" @input="handleSearchInput" v-model="searchParam" placeholder="搜索请输入关键字"
                clearable>
                <template #append>
                    <el-button @click="handleSearch" circle class="search-btn">
                        <el-icon class="search-icon">
                            <Search />
                        </el-icon>
                    </el-button>
                </template>
            </el-input>

            <!-- 项目筛选 -->
            <div class="filter-container">
                <span style="font-size: .2rem; font-weight: 400;">项目筛选：</span>
                <div class="filter-select">
                    <el-select v-model="currentAction" placeholder="更多操作" :suffix-icon='SelectIcon'
                        @change="handleActionChange(projectTable)">

                    </el-select>
                </div>
                <span style="font-size: .2rem; font-weight: 400; margin-left: .24rem;">1/50</span>
            </div>

            <!-- 搜索结果列表 -->
            <div v-if="searchVisible" class="search-results-list">
                <div v-for="project in searchResults" :key="project.id" class="project-item"
                    @click="handleProjectSelect(project)">
                    {{ project.projectName }}
                </div>
            </div>
        </div>


        <div class="actions">
            <button class="add-table-btn">+ 新增项目</button>
        </div>
    </div>
    <!-- 项目面板 -->

    <div class="panel-content">
        <div class="project-name">
            <!-- <span>阿道夫{{ projectTable.id }}、{{
                projectTable.projectInfo.projectName != "" ? projectTable.projectInfo.projectName :
                    projectTable.projectInfo.coIntentionalProject
            }}</span> -->
            <span>你好</span>
        </div>

        <div class="action-area">
            <el-button class="detail-btn">
                项目详情
            </el-button>
            <el-button class="transfer-btn" @click="openDeliverForm(projectTable)"
                :disabled="projectTable.projectID == ''">
                项目转交
            </el-button>

            <div class="task-control">
                <el-select v-model="currentAction" placeholder="更多操作" :suffix-icon='SelectIcon'
                    @change="handleActionChange(projectTable)">

                </el-select>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref, onMounted, nextTick, watch } from "vue";
import { Search } from '@element-plus/icons-vue';
import SelectIcon from "./icon/SelectDownIcon.vue";

// 搜索框相关变量
const searchParam = ref(""); // 修改为字符串类型
const searchResults: any = ref([]); // 搜索结果
const searchVisible = ref(false); // 搜索下拉框可见性
const selectedProject = ref(null); // 选中的项目

// 项目类型配置
const projects = [
    { id: "PAYMENT_COLLECTION_PROJECT", name: "项目回款" },
    { id: "MEDICAL_SYSTEM_A_CUSTOMER", name: "医疗系统A类客户" },
    { id: "MEDICAL_SYSTEM_B_CUSTOMER", name: "医疗系统B类客户" },
    { id: "EDUCATION_SYSTEM_A_CUSTOMER", name: "教育系统A类客户" },
    { id: "EDUCATION_SYSTEM_B_CUSTOMER", name: "教育系统B类客户" },
    { id: "ORGAN_INSTITUTION_PROJECT", name: "机关事业单位项目" },
    { id: "PARTNER_FOLLOW_UP", name: "合作伙伴跟进" },
    { id: "RECEIVABLE_GUARANTEE_PROJECT", name: "待收质保金项目" },
];

const projectType = ref(projects[0].id); // 默认选中项目回款

const projectTable: any = ref({})
const currentAction = ref();

// 搜索框输入变化处理
const handleSearchInput = () => {
    if (!searchParam.value.trim()) {
        searchVisible.value = false;
    }
};

// 搜索框逻辑实现
const handleSearch = async () => {
    
};

// 选择项目并跳转详情页
const handleProjectSelect = (project: any) => {
    
};

// 切换项目视图
const switchView = (id: string) => {
    projectType.value = id;
};

//打开项目转交对话框
function openDeliverForm(table: any) {

}
function handleActionChange(tableIndex: any) {

}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: flex-start;
    width: 15.5rem;
}

.title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: 400;
    margin: 0px;
}

.username {
    color: #7c68ee;
    font-weight: 700;
}

.search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: .32rem;
    width: 15.5rem;
}

.search-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    height: 100%;

}

.filter-container {
    display: flex;
    justify-content: space-between;
    height: 100%;
    align-items: center;
    margin-left: .24rem;
    /* width: 4.31rem; */
}

.filter-select :deep(.el-input__wrapper) {
    width: 2.4rem;
    height: 0.4rem;
    border: 0.01rem solid #7c68ee;
    border-radius: 0.04rem !important;
}

.search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 100;
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 5px;
    margin-top: 5px;
}

.search-header:deep(.el-input-group__append) {
    box-shadow: none !important;
    background-color: transparent !important;
}

.search-header:deep(.el-input__wrapper) {
    border-radius: 47px;
    background-color: none;
    box-shadow: none;
}

.search-input {
    width: 400px;
    height: 40px;
    border-radius: 47px;
    border: 1px solid #7c68ee;
    --el-border-color: #7c68ee;
    --el-input-border-color: #7c68ee;
    --el-input-focus-border-color: #7c68ee;
    box-sizing: border-box;
}

.search-btn {
    width: 24px;
    height: 24px;
    padding: 0;
    border: 1px solid #7c68ee;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: none;
}

.search-icon {
    color: #7c68ee;
    font-size: 18px;
}

/* 搜索结果列表样式 */
.search-results-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 5px;
    z-index: 1000;

    width: 400px;
    height: auto;

    background: #FFFFFF;
    border: 1px solid #7C68EE;
    border-radius: 8px;
    opacity: 1;
    padding: 8px 0;
    box-sizing: border-box;
}

.project-item {
    padding: 10px 16px;
    cursor: pointer;
    font-family: "Source Han Sans CN", sans-serif;
    font-weight: 400;
    font-style: normal;
    line-height: 100%;
    font-size: 16px;
    letter-spacing: 0;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background-color .15s;
    background: transparent;
    position: relative;
    z-index: 1;
}


.project-item:hover {
    background-color: rgba(124, 104, 238, 0.1);
}

/* 添加项目按钮 */
.actions {
    display: flex;
    justify-content: center;
    border: 1px solid #7c68ee;
    border-radius: 8px;
    overflow: hidden;
}

.add-table-btn {
    border: none;
    color: #7c68ee;
    font-size: .2rem;
    font-weight: 700;
    background: #f6f8fe;
    cursor: pointer;
    height: 40px;
    width: 1.54rem;
}

/* 面板 */
.panel-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;

    min-height: .29rem;
    width: 15.5rem;
    background-color: #e3e8ff;
    border-top-left-radius: .08rem;
    border-top-right-radius: .08rem;
    border: .01rem solid #7c68ee;
}

.project-name {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 1.12rem;
    height: .64rem;
    font-family: Source Han Sans CN;
    font-weight: 700;
    font-style: Bold;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    margin-left: .24rem;
}

.action-area {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: center;
    width: 4.68rem;
    height: 100%;
    margin-right: .15rem;
}

.detail-btn {
    width: 140px;
    height: 40px;
    color: black;
    border: 1px solid black;
    border-radius: 4px;
    font-size: 20px;
    font-weight: 400;
    padding: .05rem .12rem .03rem .12rem;
    background: #e3e8ff;
    margin-left: 0px;
}

.transfer-btn {
    width: 140px;
    height: 40px;
    color: black;
    border: 1px solid black;
    border-radius: 4px;
    font-size: 20px;
    font-weight: 400;
    padding: .05rem .12rem .03rem .12rem;
    background: #e3e8ff;
    margin-left: 0px;
}

/* 控制下拉框：谷歌浏览器 */
.task-control :deep(.el-input__wrapper) {
    border: 1px solid #333333;
    height: 36px;
    width: 1.17rem;
    background-color: #e3e8ff;
    box-shadow: none;
}

.task-control :deep(.el-input__inner) {
    color: #333333;
    opacity: 100%;
    height: 27px;
    background: none;
    margin-top: 6px;
}

.task-control :deep(.el-input__inner::placeholder) {
    font-size: 20px;
    font-weight: 400;
    color: black;
}
</style>