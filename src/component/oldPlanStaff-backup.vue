<template>
  <div class="container">
    <div class="header">
      <h1 style="font-size: 25px" v-if="workbencheDetailID == null || workbencheDetailID == undefined">
        <strong style="color: #a247d6">{{ username }}</strong>的工作计划
      </h1>
    </div>

    <div class="project-buttons" v-if="workbencheDetailID == null || workbencheDetailID == undefined">
      <button id="PAYMENT_COLLECTION_PROJECT" class="project-button"
        :class="{ active: projectType === 'PAYMENT_COLLECTION_PROJECT' }" @click="switchView">
        项目回款
      </button>
      <button id="MEDICAL_SYSTEM_A_CUSTOMER" class="project-button"
        :class="{ active: projectType === 'MEDICAL_SYSTEM_A_CUSTOMER' }" @click="switchView">
        医疗系统A类客户
      </button>
      <button id="MEDICAL_SYSTEM_B_CUSTOMER" class="project-button"
        :class="{ active: projectType === 'MEDICAL_SYSTEM_B_CUSTOMER' }" @click="switchView">
        医疗系统B类客户
      </button>
      <button id="EDUCATION_SYSTEM_A_CUSTOMER" class="project-button"
        :class="{ active: projectType === 'EDUCATION_SYSTEM_A_CUSTOMER' }" @click="switchView" ref="initial">
        教育系统A类客户
      </button>
      <button id="EDUCATION_SYSTEM_B_CUSTOMER" class="project-button"
        :class="{ active: projectType === 'EDUCATION_SYSTEM_B_CUSTOMER' }" @click="switchView">
        教育系统B类客户
      </button>
      <button id="ORGAN_INSTITUTION_PROJECT" class="project-button"
        :class="{ active: projectType === 'ORGAN_INSTITUTION_PROJECT' }" @click="switchView">
        机关事业单位项目
      </button>
      <button id="PARTNER_FOLLOW_UP" class="project-button" :class="{ active: projectType === 'PARTNER_FOLLOW_UP' }"
        @click="switchView">
        合作伙伴跟进
      </button>
      <button id="RECEIVABLE_GUARANTEE_PROJECT" class="project-button"
        :class="{ active: projectType === 'RECEIVABLE_GUARANTEE_PROJECT' }" @click="switchView">
        待收质保金项目
      </button>
    </div>
  </div>

  <workBenchProjectDetail :workbencheDetailID="workbencheDetailID" :workbencheDetailType="workbencheDetailType"
    :workbencheDetailUserID="workbencheDetailUserID" :workbencheDetailProjectName="workbencheDetailProjectName" v-if="workbencheDetailID != null&& projectStatus != 'PLACE_ON_FILE'" />
  <PlaceInFileProjectDetail :workbencheDetailID="workbencheDetailID" :workbencheDetailType="workbencheDetailType"
    :workbencheDetailUserID="workbencheDetailUserID" :workbencheDetailProjectName="workbencheDetailProjectName" v-else-if="workbencheDetailID != null && projectStatus == 'PLACE_ON_FILE'" />
  <AllProjectRouter v-else :projectType="projectType" />
</template>

<script setup lang="ts" name="List">
import { ElMessage, ElMessageBox } from "element-plus";
import { createApp, ref, reactive, onMounted, nextTick, computed, watch } from "vue";
import paymentCollection from "./paymentCollection.vue";
import MedicalSystemA from "./MedicalSystemA.vue";
import MedicalSystemB from "./MedicalSystemB.vue";
import EducationSystemA from "./EducationSystemA.vue";
import EducationSystemB from "./EducationSystemB.vue";
import OrganInstitution from "./OrganInstitution.vue";
import PartnerFollowUp from "./PartnerFollowUp.vue";
import ReceivableGuarantee from "./ReceivableGuarantee.vue";
import workBenchProjectDetail from "./oldworkBenchProjectDetail.vue";
import AllProjectRouter from './AllProjectRouter.vue'
import PlaceInFileProjectDetail from './oldPlaceInFileProjectDetail.vue'
import {
  getChangeList,
  getProjectDetail,
  getProjectId,
  getProjectProgressList,
  getProjectRecordList,
  updateProjectStatus,
} from "@/api/website";
import { getUserInfo } from "@/api/index";

import { type FollowRecords } from "@/plan_types";
import { useRoute } from "vue-router";
import router from "@/router";

const route = useRoute();
let workbencheDetailID: any = ref(route.query.id);
let workbencheDetailType: any = ref(route.query.projectType);
let workbencheDetailUserID: any = ref(route.query.employeeId);
let workbencheDetailProjectName: any = ref(route.query.projectName);
let projectType: any = ref("");
const initial = ref();
const projectStatus = ref("");

const userData = localStorage.getItem("user");
let username = ref(userData ? JSON.parse(userData).realName : "未知用户");

// getProjectDetail(workbencheDetailID.value).then((res: any) => {
//   if (res.code == 200) {
//     projectStatus.value = res.data.status
//   } else ElMessage.warning(res.msg);
// });



// 监听路由变化
watch(
  () => route.query,
  (newQuery) => {
    workbencheDetailID.value = newQuery.id || null;
    workbencheDetailType.value = newQuery.projectType || null;
    workbencheDetailUserID.value = newQuery.employeeId || null;
    // console.log('workbencheDetailID=', workbencheDetailID.value);
    // console.log('workbencheDetailType=', workbencheDetailType.value);
    // console.log('workbencheDetailUserID=', workbencheDetailUserID.value); 


    // 当路由参数为空时，触发项目列表显示
    if (newQuery.id == null || newQuery.id == undefined) {
      nextTick(() => {

        initial.value.click();

      });
    }
    else if (newQuery.id != null || newQuery.id != undefined) {
      nextTick(() => {

        projectType.value = ''

      });
    }
  },
  { deep: true }
);

function switchView(event: any) {
  // getProjectAllData(event.target.id)
  projectType.value = event.target.id;
}

// 跳转工作台路由
const goBack = () => {

  router.back()

};

onMounted(() => {
  console.log("路由传入的workbencheDetailID为" + workbencheDetailID.value);
  console.log("路由传入的workbencheDetailType为" + workbencheDetailType.value);
  console.log("路由传入的workbencheDetailUserID为" + workbencheDetailUserID.value);
  if (workbencheDetailID.value == null || workbencheDetailID.value == undefined) {
    console.log("路由传入的workbencheDetailID为空");
    nextTick(() => {
      if (initial.value) {
        initial.value.click();
      }
    });
  } else {
    console.log("路由传入的workbencheDetailID为不空");
    projectType.value = null;
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 1630px;
  margin: 0 auto;
}

.header {
  text-align: left;
  margin-bottom: 30px;
  display: flex;
  /* font-size: 25px; */
  /* padding: 20px; */

  .button-back {
    padding: 10px 25px;
    border-radius: 4px;
    background-color: #7c68ee;
    color: #fff;
    border: none;
  }
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
  border: 1px solid black;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 150px;
}

.project-button.active {
  color: white;
  background-color: #7c68eecc;
}

.project-button:hover:not(.active) {
  color: white;
  background-color: #9181f0cc;
}
</style>
