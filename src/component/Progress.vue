<template>
    <!-- 任务流程部分 -->
    <div class="progress" :class="{ paused: projectDetail.status == 'PAUSE' }">
        <div class="go-next"><span>下一步</span></div>
        <div class="task-flow" ref="ref_task_flow">
            <div class="task-node-container" v-for="(task, i) in tasks" :key="i">
                <div class="task-node" :class="{
                    active: task.status === 'DOING',
                    completed: task.status === 'FINISHED',
                    paused: projectDetail.status == 'PAUSE',
                }">
                    <div class="circle_connector">
                        <div v-if="i > 0" :key="i" class="connector-line" :class="{
                            paused: projectDetail.status === 'PAUSE' && task.status !== 'FINISHED',
                            completed: task.status === 'FINISHED',
                            active: task.status === 'DOING',
                        }"></div>
                        <div class="task-circle">
                            <span v-if="task.status === 'FINISHED'">✓</span>
                            <span v-else>{{ i + 1 }}</span>
                        </div>
                    </div>

                    <div class="task-text">
                        <div class="task-content-text">
                            <div class="task-name">
                                <div>{{ task.content }}</div>
                                <div v-if="task.content == '方案上会' || task.content == '财政局财评、立项通过会' || task.content == '采购需求确定'"
                                    style="margin-left: 3px;"><img src="./icon/感叹号.png" alt=""></div>
                            </div>

                        </div>
                        <div class="task-status-text">
                            <span>未进行</span>
                        </div>
                    </div>
                </div>

                <div class="task-time" v-if="task.status === 'FINISHED'">
                    {{ task.finishTime }}
                </div>
                <div class="task-time" :class="{ active: task.status === 'DOING' }" v-else-if="task.status === 'DOING'">
                    进行中...
                </div>
                <div class="task-time" :class="{ active: task.status === 'DOING' }" v-else>
                    未进行
                </div>

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

const tasks = ref([
    { content: "已拜访邀约体验", status: "FINISHED", finishTime: "2022-03-12" },
    { content: "已到公司体验", status: "FINISHED", finishTime: "2022-03-12" },
    { content: "已报方案", status: "FINISHED", finishTime: "2022-03-12" },
    { content: "阳光推荐会确定方案", status: "FINISHED", finishTime: "2022-03-12" },
    { content: "方案上会", status: "FINISHED", finishTime: "2022-03-12" },
    { content: "客户各级审批", status: "FINISHED", finishTime: "2022-03-12" },
    {
        content: "财政局财评立项通过会",
        status: "DOING",
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
])
</script>

<style scoped>
.progress {
    /* flex: 1;
    height: 100%; */
    height: 768px;
    width: 328px;
    padding: 16px;
    position: relative;
}

.go-next {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    vertical-align: middle;
    width: 328px;
    height: 40px;
    border: 1px solid #7c68ee;
    border-radius: 8px;
}

/* 任务流程样式 */
.task-flow {
    display: flex;
    flex-direction: column;
    /* flex-wrap: nowrap; */
    overflow-y: auto;
    position: relative;
    width: 100%;
    height: 680px;
    margin-top: 16px;
    gap: 16px;
    /* z-index: 0; */
    /* scrollbar-width: thin;
    scrollbar-color: #7c68ee #f0f0f0; */
}


/* 添加滚动条样式 */
/* .task-flow::-webkit-scrollbar {
    height: 6px;
}

.task-flow::-webkit-scrollbar-track {
    background: #f0f0f0;
}

.task-flow::-webkit-scrollbar-thumb {
    background-color: #7c68ee;
    border-radius: 3px;
} */



/* 添加连接线样式 */
.connector-line {
    width: 3px;
    height: 50px;
    border: 1px solid #BACAC6;
    border-radius: 2px;
    background-color: #BACAC6;
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
    flex-direction: column;
    align-items: center;
    position: relative;
    height: 64px;
}

.task-node {
    display: flex;
    align-items:end;
    justify-content: space-between;
    height: 40px;
    width: 100%;
    /* 确保节点在连接线上方 */
}

.task-text {
    width: 278px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #7c68ee;
    border-radius: 4px;
}

.task-content-text {
    /* display: flex;
    flex-direction: column;
    align-items: center; */
    min-height: 20px;
}

.circle_connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
}

.task-circle {
    width: 16px;
    height: 16px;
    border-radius: 16px;
    background: #BACAC6;
    border: none;
    font-weight: 400;
    color: #999999;
    font-size: 10px;

    text-align: center;

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

.task-time {
    flex: 1;
    font-size: 15px;
    color: #27ae60;
    text-align: center;
    height: 20px;
}

.task-time.active {
    flex: 1;
    font-size: 15px;
    color: #7c68ee;
    text-align: center;
    padding: 0;
    border-radius: 25px;
    border-width: 1px;
    border-color: #7c68ee;
    height: 50%;
    width: 100%;
}

.paused .task-time {
    color: #7f8c8d;
}

.task-name {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    text-align: center;
    vertical-align: middle;
    color: #555;
    font-weight: 400;
}
</style>