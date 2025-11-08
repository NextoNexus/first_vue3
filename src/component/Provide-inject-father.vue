<template>
    <div class="father">
        <span>{{ datas.title }}</span>
        <br>
        <input type="text" v-model="datas.inputForm">
        <ProvideInjectSon title="第一个儿子组件"/>
        <ProvideInjectSon title="第二个儿子组件"/>
    </div>
    
</template>

<script lang="ts" setup>
import { computed, inject, provide, reactive, ref } from 'vue'
import ProvideInjectSon from './Provide-inject-son.vue';
const datas = reactive({
    inputForm:'',
    title:'父亲组件'
})

provide('datas',datas);

</script>

<!-- 声明局部样式scoped，选择器仅识别本组件内的标签元素，
 避免影响到别的组件的标签元素 -->
<style scoped>
.father{
    min-height: 500px;
    background-color: rgb(92, 111, 111);
}
</style>