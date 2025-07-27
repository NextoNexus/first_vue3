<template>
    <h2>{{ father_a }}</h2>
    <h2>{{ father_b }}</h2>
    <ul>
        <li v-for="car in father_list" :key="car.brand">{{ car.brand }}-{{ car.price }}</li>
    </ul>
    
</template>

<script lang="ts" setup name="Car">
    import { DefineProps, withDefaults } from 'vue';
    import { type Cars } from '@/types';

    //接收父组件传来的参数
    //defineProps(['father_a','father_b'])

    //接收参数+限制类型
    //defineProps<{father_list:Cars}>()

    //接收参数+限制类型+限制必要性
    //defineProps<{father_list?:Cars}>()


    // 接收参数+限制类型+接收必要性+默认值
    const props=withDefaults(defineProps<{father_list?:any,father_a?:any, father_b?:any}>(),{

    })
    console.log(props.father_a);
    console.log(props.father_list);
    console.log(props.father_list[0]);
    
    
    
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