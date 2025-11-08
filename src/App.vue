<template>
  <!-- HTML标签的ref声明将此标签声明为【独立的DOM元素】，不会与其他相同
   ref的DOM冲突，保证了独立性，相比"id"独立性更好 -->
  <!-- <h2 ref="h2">这是App的h2标签</h2>
  <button @click="showlog">点我打印App的h2标签</button>
  <button @click="showlabelref">点我打印LabelRef组件的value</button> -->
  <!-- 组件式ref声明将此组件声明为【响应式组件实例】，使得父组件App能够通过
   labelref访问子组件LabelRef的数据，实现组件通信 -->
  <!-- <LabelRef ref="labelref" /> -->
  <!-- <interfaceType /> -->

  <!-- 给子组件传入参数。 ":"有点像python的eval() -->
  <!-- <Props  father_b="heihei" :father_c="1 + 1" :father_list="list" /> -->

  <!-- <LifeCircle ref="lifecircle" v-if="showif"/> -->
  <!-- <button @click="showlifeciecle">点我查看sum</button> -->
  <!-- <EducationSystemA projectType="default"/> -->
   <!-- <PlanSelf/> -->
    <!-- <ProjectInfo/> -->
     <!-- <Progress/> -->
  <!-- <ProvideInjectFather/> -->
   <!-- <addParticipantPanel/> -->
  <div class="box">
    hello world!!!!!
  </div>
</template>

<script lang="ts" setup name="App">
import interfaceType from './component/interfaceType.vue';
import LabelRef from './component/LabelRef.vue';
import Props from './component/Props.vue';
import LifeCircle from './component/LifeCircle.vue';
import EducationSystemA from "./component/EducationSystemA.vue";
import PlanSelf from "./component/PlanSelf.vue";
import Progress from "./component/Progress.vue";
import ProjectInfo from "./component/ProjectInfo.vue";
import ProvideInjectFather from './component/Provide-inject-father.vue';
import addParticipantPanel from './component/addParticipantPanel.vue';

import { reactive, ref } from 'vue';
import { Cars } from './types';

let h2 = ref()
let labelref = ref()
let lifecircle = ref()
let showif=ref(true)
function showlog() {
  // console.log(h2);
  console.log(h2.value);

}

function showlifeciecle(){
  console.log(lifecircle.value.sum);
  
}

function showlabelref() {
  console.log(labelref.value);
  console.log(labelref.value.temp);
  console.log(labelref.value.height);



}

let list = reactive([
  { brand: 'BMW', price: 1000000 },
  { brand: 'Bentz', price: 200 }

])

</script>

<style>
.box{
  font-family: MonoCraft;
}
</style>
