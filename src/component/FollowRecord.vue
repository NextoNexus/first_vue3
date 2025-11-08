<template>
    <div class="follow-record">
        <div class="table-header">
            <div class="table-header-name"><span>跟进记录</span></div>
        </div>
        <div class="follow-record-content">

            <el-table :data="tableData" style="width: 100%;">
                <el-table-column prop="startTime" label="时间" width="140" height="56" />
                <el-table-column prop="record" label="记录" width="320" />
                <el-table-column prop="predictTarget" label="预期目标" width="320" />
                <el-table-column prop="nextPlan" label="下一步计划" width="240" />

                <el-table-column prop="name" label="协调" width="140">
                    <template #default="{ row }">
                        <el-button class="coordination-btn" @click="openCoordination(row)"
                            :disabled="projectDetail.status == 'PAUSE'">
                            <i class="fas fa-users"></i> 进入协调
                        </el-button>
                    </template>
                </el-table-column>


            </el-table>

            <div class="footer">
                <el-button class="add-btn" @click="openAddForm"
                    :disabled="projectDetail.id == null || projectDetail.status == 'PAUSE'">
                    保存
                </el-button>

                <el-pagination class="record-page-panel" layout="prev, pager, next" :total="total"
                    :page-size="pageSize" :current-page="currentPage"
                    @current-change="(page: any) => handlePageChange(page)">
                </el-pagination>
            </div>
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const projectDetail = ref({
    "acceptedContractMoney": 0,
    "backTime": "",
    "budgetMoney": 0,
    "checkFlag": "",
    "coIntentionalProject": "",
    "coIntentionalUnit": "",
    "commander": "",
    "contact": "",
    "departName": "",
    "employeeId": 0,
    "guaranteeExpireTime": "",
    "guaranteeMoney": 0,
    "guaranteePeriod": 0,
    "id": '123445',
    "payType": "",
    "performanceBondMoney": 0,
    "preMoney": 0,
    "progressMoney": 0,
    "projectName": "",
    "startTime": "",
    "status": "",
    "type": "",
    "unitName": "",
    "unitType": ""
})

const tableData = ref([
    {
        "endTime": "asfd",
        "id": 0,
        "nextPlan": "safd",
        "predictTarget": "sfd",
        "projectId": 0,
        "record": "asf",
        "startTime": "sdf",
        "userId": 0
    },
    {
        "endTime": "sdf",
        "id": 0,
        "nextPlan": "sfd",
        "predictTarget": "safd",
        "projectId": 0,
        "record": "sadf",
        "startTime": "sadf",
        "userId": 0
    },
    {
        "endTime": "sadf",
        "id": 0,
        "nextPlan": "sdaf",
        "predictTarget": "sdf",
        "projectId": 0,
        "record": "sdaf",
        "startTime": "sdaf",
        "userId": 0
    },
    {
        "endTime": "sadf",
        "id": 0,
        "nextPlan": "sdaf",
        "predictTarget": "sdf",
        "projectId": 0,
        "record": "sdaf",
        "startTime": "sdaf",
        "userId": 0
    },
    {
        "endTime": "sadf",
        "id": 0,
        "nextPlan": "sdaf",
        "predictTarget": "sdf",
        "projectId": 0,
        "record": "sdaf",
        "startTime": "sdaf",
        "userId": 0
    }
])

// 分页请求参数
const total=ref(50)
const pageSize=ref(5)
const currentPage=ref(1)

// 打开协调管理对话框
const openCoordination = (record: any) => {

};
// 打开新增记录对话框
const openAddForm = () => {

};
// 分页变化处理
const handlePageChange = (page: any) => {
    
};
</script>

<style scoped>
.follow-record {
    display: flex;
    justify-content: center;
    align-items: center;
    
    height: 50%;
    width: 100%;
}

.table-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: .48rem;
    height: 100%;
    font-size: .2rem;
    font-weight: 400;
    border-bottom:.01rem solid #7c68ee;
}

.table-header-name {
    display: flex;
    justify-content: center;
    align-items: center;
    width: .32rem;
    height: 3.16rem;

    font-family: Source Han Sans CN;
    font-weight: 400;
    font-style: Regular;
    font-size: 20px;
    letter-spacing: 0%;
    text-align: center;
    vertical-align: middle;

}

.follow-record-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.follow-record-content:deep(.el-table .cell) {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    vertical-align: middle;
}

.follow-record-content:deep(.el-table th.el-table__cell) {
    height: .48rem;
    border-width: 0rem 0rem .01rem .01rem;
    border-style: solid;
    border-color: #7c68ee;
}

.follow-record-content:deep(.el-table td.el-table__cell) {
    height: .56rem;
    border-width: 0rem 0rem .01rem .01rem;
    border-style: solid;
    border-color: #7c68ee;
}


.coordination-btn {
    /* background-color: #6a5af9; */
    width: .64rem;
    height: .23rem;
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
}

.footer {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: .01rem solid #7c68ee;
    border-bottom: .01rem solid #7c68ee;
    border-left: .01rem solid #7c68ee;
}

.add-btn {
    border: .01rem solid #7c68ee;
    border-radius: 4px;
    background-color: #7c68ee;

    color: #FFFFFF;

    width: 120px;
    height: 32px;
    font-size: 16px;
    font-weight: 400;
    margin-left: .1rem;
}

.record-page-panel:deep(.el-pager li.is-active, .el-pager li:hover) {
    border: .01rem solid #7c68ee;
    border-radius: .04rem;
    color: #7c68ee;
}
.record-page-panel{
    margin-right: .24rem;
}
</style>