<template>
    <div class="person">
        <h2>name:{{ name }}</h2>
        <h2>age:{{ age }}</h2>
        <h2>address:{{ addr }}</h2>
        <button @click="editname">edit name</button>
        <button @click="editage">edit age</button>
        <button @click="showtel">show the tel</button>
        
    </div>
    <hr>
</template>

<script lang="ts" setup name="Person123">
import {ref} from 'vue'
let name=ref('zouhaonan')
let age=ref(18)
let tel=123456
let addr = 'beijing'

function showtel() {
    alert(tel)
}
function editname(){
    var newname=prompt('input your name')
    name.value = newname
}
function editage(){
    age.value+=1
}
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
    border-radius:20px;
}
button{
    position: relative;
    /* margin-left: 50px;  */
}

</style>