<template>
    <div class="change-record">
        <div class="table-header">
            <div class="table-header-name"><span>变更记录</span></div>
        </div>
        <div class="change-record-content">

            <el-table :data="tableData" style="width: 100%;" max-height="328">
                <el-table-column prop="createTime" label="时间" width="140" />
                <el-table-column prop="username" label="变更人" width="160" />
                <el-table-column prop="departName" label="变更部门" width="160" />
                <el-table-column prop="description" label="变更动作" width="700" />


            </el-table>

            <div class="footer">
                <el-pagination class="record-page-panel" layout="prev, pager, next" :total="total" :page-size="pageSize"
                    :current-page="currentPage" @current-change="(page: any) => handlePageChange(page)">
                </el-pagination>
                <div class="change-page-select">
                    <el-select v-model="changePageSize" @change="changeRecordhandlePageSizeChange()"
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SelectIcon2 from './icon/SelectDownIcon2.vue'

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
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    },
    {
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    },
    {
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    },
    {
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    },
    {
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    },
    {
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    },
    {
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    },
    {
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    },
    {
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    },
    {
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    },
    {
        "createTime": "阿道夫",
        "departName": "阿斯弗",
        "description": "风格士大夫",
        "id": 0,
        "projectId": 0,
        "username": "发给对方"
    }
])

// 分页请求参数
const total = ref(50)
const pageSize = ref(5)
const currentPage = ref(1)

const changePageSize = ref(10)

// 分页变化处理
const handlePageChange = (page: any) => {

};
//页大小设置处理
function changeRecordhandlePageSizeChange() {

}
</script>

<style scoped>
.change-record {
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

.change-record-content {
    flex: 1;
    display: flex;
    flex-direction:column;
    height: 100%;
}

.change-record-content:deep(.el-table .cell) {
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

.change-record-content:deep(.el-table th.el-table__cell) {
    height: .48rem;
    border-width: 0rem 0rem .01rem .01rem;
    border-style: solid;
    border-color: #7c68ee;
}

.change-record-content:deep(.el-table td.el-table__cell) {
    height: .56rem;
    border-width: 0rem 0rem .01rem .01rem;
    border-style: solid;
    border-color: #7c68ee;
}

.footer {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: .01rem solid #7c68ee;
    border-left: .01rem solid #7c68ee;
}

.record-page-panel:deep(.el-pager li.is-active, .el-pager li:hover) {
    border: .01rem solid #7c68ee;
    border-radius: .04rem;
    color: #7c68ee;
}
.record-page-panel{
    margin-right: .24rem;
}

.change-page-select :deep(.el-input__wrapper) {
    border: 1px solid #333333;
    height: .32rem;
    width: 1.0rem;
    margin-right: 24px;
    box-shadow: none;
}

.change-page-select :deep(.el-input__inner) {
    color: #333333;
    font-size: 16px;
    font-weight: 400;
    width: 40%;
    text-align: center;
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
</style>