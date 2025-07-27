<template>
    <div class="person">
        
        <h2>水温={{ temp }}度</h2>
        <h2>水位={{ height }}cm</h2>
        <button @click="addtemp">升温</button>
        <button @click="addheight">升水位</button>
        
    </div>
        
</template>

<script lang="ts" name="Watcheffect" setup>
import { ref, reactive, watch, watchEffect } from 'vue';
let temp = ref(10)
let height = ref(0)
function addtemp(){
    temp.value+=10
}
function addheight(){
    height.value+=10
}

watch([temp,height],(newvalue,oldvalue)=>{
    let [temp,height]=newvalue
    if (temp>=100){
        alert('水温过高')
        
    }
    if (height>=100) alert('水位过高')
})

//watcheffect相当于监视所有响应式数据，更关注目标逻辑
watchEffect(()=>{
    if (temp.value>=50) {
        console.log('水温过高');
        
    }
    if (height.value>=50) {
        console.log('水位过高');
        
    }
})
 
 
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