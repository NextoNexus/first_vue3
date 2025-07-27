<template>
    <h2>{{ car.brand }}</h2>
    <h2>{{ car.price }}</h2>
    <button @click="changeprice">点我修改车价格</button>
</template>

<script lang="ts" setup name="Car">
    import {type CarInterface, type Cars } from '@/types';
    import { ref } from 'vue';
    //后面加:CarInterface表示需要符合该接口的规范,
    //防止键写错
    let car:CarInterface = {brand:'BMW',price:12}
    //:Array表示符合数组泛型的格式，<CarInterface>表示
    //该数组的每一个元素需要符合该接口的格式规范

    let cararr:Array<CarInterface>=[
        {brand:'BMW',price:120},
        {brand:'Bentz',price:12},
        {brand:'Yadi',price:2}
    ]
    
    //或者在接口文档中定义Cars类型，简化代码量
    let cararr2:Cars=[
        {brand:'BMW',price:120},
        {brand:'Bentz',price:12},
        {brand:'Yadi',price:2}
    ]

    //

    function changeprice(){
        car.price+=10
    }
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