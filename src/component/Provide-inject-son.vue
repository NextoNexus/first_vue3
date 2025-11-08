<template>
    <div class="son">
        <span>{{ props.title }}</span>
        <br>
        <input type="text" v-model="datas.inputForm">
    </div>
</template>

<script lang="ts" setup>
import { computed, inject, reactive, ref } from 'vue'
interface Datas{
    inputForm:string,
    title:string
}
const props = defineProps([
    'title'
])
const datas:Datas = inject('datas');

</script>

<!-- 声明局部样式scoped，选择器仅识别本组件内的标签元素，
 避免影响到别的组件的标签元素 -->
<style scoped>
.son {
    margin-top: 50px;
    min-height: 100px;
    background-color: aqua;
}
</style>