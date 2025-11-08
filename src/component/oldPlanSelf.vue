<template>
    <div class="container">
        <div class="header" v-if="!workbenchDetailID"> 
            <p class="title">
                <span class="username">{{ username }}</span>的工作计划
            </p>
        </div>

        <div class="search-header" v-if="!workbenchDetailID">
            <!-- 搜索框 -->
            <div class="search-left">
                <div class="search-container">
                    <el-input class="search-input" @input="handleSearchInput" v-model="searchParam"
                        placeholder="搜索请输入关键字" clearable>
                        <template #append>
                            <el-button @click="handleSearch" circle class="search-btn">
                                <el-icon class="search-icon">
                                    <Search />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>

                    <!-- 搜索结果列表 -->
                    <div v-if="searchVisible" class="search-results-list">
                        <div v-for="project in searchResults" :key="project.id" class="project-item"
                            @click="handleProjectSelect(project)">
                            {{ project.projectName }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="actions">
                <button class="add-table-btn" @click="callAddParentTable">+ 新增项目</button>
            </div>
        </div>

        <div class="project-buttons" v-if="!workbenchDetailID">
            <button v-for="project in projects" :key="project.id" :id="project.id" class="project-button"
                :class="{ active: projectType === project.id }" @click="switchView(project.id)" ref="initial">
                {{ project.name }}
            </button>
        </div>

        <!-- 项目详情页 -->
        <template v-if="workbenchDetailID">
            <PlaceInFileProjectDetail v-if="projectStatus === 'PLACE_ON_FILE'" :workbenchDetailID="workbenchDetailID"
                :workbenchDetailType="workbenchDetailType" :workbenchDetailUserID="workbenchDetailUserID"
                :workbenchDetailProjectName="workbenchDetailProjectName" />
            <workBenchProjectDetail v-else :workbenchDetailID="workbenchDetailID"
                :workbenchDetailType="workbenchDetailType" :workbenchDetailUserID="workbenchDetailUserID"
                :workbenchDetailProjectName="workbenchDetailProjectName" :RouteAction="RouteAction" />
        </template>

        <!-- 项目列表页 -->
        <AllProjectRouter ref="AllProjectRouterComponent" v-else :projectType="projectType" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import workBenchProjectDetail from "./oldworkBenchProjectDetail.vue";
import PlaceInFileProjectDetail from './oldPlaceInFileProjectDetail.vue';
import AllProjectRouter from './AllProjectRouter.vue';
import { getProjectDetail, searchProject } from "@/api/website";
import { Search } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

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

// 响应式数据
const projectType = ref(projects[0].id); // 默认选中项目回款
const projectStatus = ref("");
const initial = ref();
const AllProjectRouterComponent=ref();

// 安全获取用户信息
const getUserName = () => {
    try {
        const userData = localStorage.getItem("user");
        if (!userData) return "未知用户";
        const user = JSON.parse(userData);
        return user?.realName || "未知用户";
    } catch (e) {
        console.error("解析用户信息失败", e);
        return "未知用户";
    }
};

const username = ref(getUserName());

// 路由参数处理
let workbenchDetailID: any = ref(route.query.id);
let workbenchDetailType: any = ref(route.query.projectType);
let workbenchDetailUserID: any = ref(route.query.employeeId);
let workbenchDetailProjectName: any = ref(route.query.projectName);
let RouteAction:any = ref(route.query.RouteAction);

// 搜索框相关变量
const searchParam = ref(""); // 修改为字符串类型
const searchResults:any = ref([]); // 搜索结果
const searchVisible = ref(false); // 搜索下拉框可见性
const selectedProject = ref(null); // 选中的项目

// 搜索框输入变化处理
const handleSearchInput = () => {
    if (!searchParam.value.trim()) {
        searchVisible.value = false;
    }
};

// 搜索框逻辑实现
const handleSearch = async () => {
    if (!searchParam.value.trim()) {
        ElMessage.warning("请输入搜索关键字");
        searchVisible.value = false;
        return;
    }

    try {
        console.log('搜索参数:', searchParam.value);
        const res = await searchProject(searchParam.value as string);
        console.log('搜索接口响应:', res);
        const data = res.data;

        if (res && res.code === 200) {

            searchResults.value = res.data || [];
            console.log('响应数据:', res.data);
            console.log('搜索结果:', searchResults.value);
            console.log('搜索结果数量:', searchResults.value.length);
            searchVisible.value = searchResults.value.length > 0;
            if (searchVisible.value) {
                console.log('搜索结果下拉框已显示');
            } else {
                ElMessage.info("没有找到匹配的项目");
            }
        } else {
            const errorMsg = data?.msg || "搜索失败，接口返回异常";
            ElMessage.warning(errorMsg);
            console.warn('搜索失败:', errorMsg);
            searchVisible.value = false;
        }
    } catch (error) {
        console.error('搜索接口调用失败:', error);
        ElMessage.error(`搜索接口调用失败: ${(error as any).message || '未知错误'}`);
        searchVisible.value = false;
    }
};

// 选择项目并跳转详情页
const handleProjectSelect = (project: any) => {
    if (!project) return;

    const {
        id,
        employeeId,
        type,
        projectName
    } = project;

    selectedProject.value = project;
    searchVisible.value = false;
    searchParam.value = projectName; // 显示选中的项目名称

    // 跳转到项目详情页
    router.push({
        path: "/weblayout/plan_self",
        query: {
            id: String(id),
            employeeId: String(employeeId ?? ""),
            projectType: String(type ?? ""),
            projectName: String(projectName ?? ""),
            RouteAction: 'search'
        },
    });
};

function callAddParentTable() {
    console.log('在父组件中点击了callAddParentTable');
    
    if (AllProjectRouterComponent.value) {
        AllProjectRouterComponent.value.addParentTable()
    }
}

// 获取项目状态
const fetchProjectStatus = async (id: string) => {
    try {
        const res = await getProjectDetail(id);
        if (res.code === 200) {
            projectStatus.value = res.data.status;
        } else {
            ElMessage.warning(res.msg || "获取项目状态失败");
        }
    } catch (error) {
        console.error("获取项目详情失败", error);
        ElMessage.error("获取项目详情失败");
    }
};

// 切换项目视图
const switchView = (id: string) => {
    projectType.value = id;
};

// 监听路由变化
watch(
    () => route.query,
    (newQuery) => {
        workbenchDetailID.value = newQuery.id;
        workbenchDetailType.value = newQuery.projectType;
        workbenchDetailUserID.value = newQuery.employeeId;
        workbenchDetailProjectName.value = newQuery.projectName;
        RouteAction.value = newQuery.RouteAction

        // 当有项目ID时获取项目状态
        if (workbenchDetailID.value) {
            fetchProjectStatus(workbenchDetailID.value);
        }
    },
    { immediate: true, deep: true }
);

// 组件挂载逻辑
onMounted(() => {
    console.log("初始化项目管理页面");

    // 只有在列表页时才设置默认项目类型
    if (!workbenchDetailID.value) {
        nextTick(() => {
            if (initial.value) {
                // 设置默认选中的项目类型
                projectType.value = projects[0].id;
            }
        });
    }
});
</script>

<style scoped>

.container {
    max-width: 1630px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: flex-start;
    /* margin-bottom: 24px; */
    /* padding-bottom: 24px; */
}

.title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: 400;
}

.username {
    color: #7c68ee;
    font-weight: 700;
}

.search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
}

.search-container {
    position: relative;
    width: 100%;
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

.actions {
    display: flex;
    justify-content: center;
    background: #f6f8fe;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #7c68ee;
    border-radius: 8px;
    width: 1.905rem;
}

.add-table-btn {
    border: none;
    color: #7c68ee;
    /* padding: 12px 34px; */
    font-size: .2rem;
    font-weight: 700;
    background: #f6f8fe;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 48px;
    width: 180px;
}

.project-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 24px;
    height: 40px;
}

.project-button {
    flex: 1;
    min-width: 180px;
    max-width: 220px;
    background-color: white;
    border: 1px solid #333333;
    border-radius: 4px;
    padding: 6px 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); */
    height: 100%;
}

.project-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #7c68ee;
}

.project-button.active {
    color: white;
    background: #7c68ee;
    border-color: #7c68ee;
    box-shadow: 0 4px 12px rgba(124, 104, 238, 0.3);
}

.project-button:not(.active):hover {
    color: #7c68ee;
    background-color: #f8f7ff;
}
</style>