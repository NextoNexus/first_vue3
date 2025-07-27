<template>
    <h2>sum 为 {{ sum }}</h2>
    <button @click="add">点我sum+1</button>
    
</template>

<script lang="ts" setup name="Car">
    import { ref } from 'vue';
    import { onBeforeMount, onMounted, onBeforeUpdate,onUpdated,
        onBeforeUnmount, onUnmounted
     } from 'vue';
    let sum = ref(0)
    function add(){
        sum.value+=1
    }
    defineExpose({sum})

    //创建组件
    console.log('子组件创建');

    //组件挂载前
    onBeforeMount(()=>{
        console.log('挂载前');
        
    })
    //组件挂载完毕
    onMounted(()=>{
        console.log('挂载完毕');
        
    })
    //组件更新
    onBeforeUpdate(()=>{
        console.log('组件更新前');
        
    })
    //组件更新完毕
    onUpdated(()=>{
        console.log('组件更新完毕');
        
    })
    //组件卸载前
    onBeforeUnmount(()=>{
        console.log('组件卸载前');
        
    })
    //组件卸载完毕
    onUnmounted(()=>{
        console.log('组件卸载完毕');
        
    })
    
</script>

<!-- 声明局部样式scoped，选择器仅识别本组件内的标签元素，
 避免影响到别的组件的标签元素 -->
<style scoped>
.container{

    padding-left: 50px;
    padding-right: 50px;
}
.Car {
    /* position: relative; */
    height: 300px;
    width: 100%;
    /* top: 100px; */
    
    /* overflow: hidden; */

    background-color: rgb(161, 25, 182);
    border-radius: 20px;
    box-shadow: 0 0 10px;
    float: left;
}

button {
    position: relative;
    left: 30px;
    /* margin-left: 50px;  */
}

h2 {
    
    /* position: relative; */
    text-align: center;
    width: 50%;
    background-color: bisque;
    /* float: left; */
}
.col{
    /* position: relative; */
    height: 300px;
    width: 50px;
    border-radius: 10px;
    box-shadow: 0 0 10px;
    background-color: brown;
    float:left
}
.left{
    position: relative;
    margin-left: -100%;
    left: -50px;
}
.right{
    position: relative;
    margin-left: -50px;
    left: 50px;
}
</style>