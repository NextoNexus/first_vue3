<template>
    <div class="person">
        <h2 ref="h2">水温={{ temp }}度</h2>
        <h2>水位={{ height }}cm</h2>
        <button @click="addtemp">升温</button>
        <button @click="addheight">升水位</button>
        <button @click="showlog">点我打印水温的h2标签</button>
    </div>
        
</template>

<script lang="ts" name="Watcheffect" setup>
import { ref, reactive, watch, watchEffect,defineExpose } from 'vue';
let temp = ref(10)
let height = ref(0)
let h2 = ref()

function showlog(){
    console.log(h2.value);
}
function addtemp(){
    temp.value+=10
}
function addheight(){
    height.value+=10
}

//defineExpose 用于将内部的数据导出到组件外部，
//使得父组件能够访问子组件导出的数据，在【实现组件通讯】的
//同时【保证安全性】。
defineExpose({temp,height})

// watch([temp,height],(newvalue,oldvalue)=>{
//     let [temp,height]=newvalue
//     if (temp>=100){
//         alert('水温过高')
        
//     }
//     if (height>=100) alert('水位过高')
// }) 

//watcheffect相当于监视所有响应式数据，更关注目标逻辑
// watchEffect(()=>{
//     if (temp.value>=50) {
//         console.log('水温过高');
        
//     }
//     if (height.value>=50) {
//         console.log('水位过高');
        
//     }
// })


</script>

<!-- 声明局部样式scoped，选择器仅识别本组件内的标签元素，
 避免影响到别的组件的标签元素 -->
<style scoped>
.person {
    position: relative;
    /* height: 100px; */
    /* top:50px; */
    /* padding-left: 50px;
    padding-right: 200px; */
    overflow: hidden;

    background-color: rgb(61, 225, 28);
    border-radius: 20px;
}

button {
    position: relative;
    /* margin-left: 50px;  */
}
</style>