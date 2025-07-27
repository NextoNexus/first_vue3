<template>
    <div class="person">
        <h1>情况一：监视【ref】创建的【基本类型】数据</h1>
        <h2>当前的sum为{{ sum }}</h2>
        <button @click="addsum">点我sum加一</button>
        <h1>情况二：监视【ref】创建的【对象类型】数据</h1>
        <h2>name={{ person.name }}</h2>
        <h2>age={{ person.age }}</h2>
        <button @click="changename">点我修改名字</button>
        <button @click="changeage">点我修改年龄</button>
        <button @click="changeperson">点我修改整个person</button>
        <h1>情况三：监视【reactive】创建的【对象类型】数据</h1>
        <h2>name={{ car.brand }}</h2>
        <h2>age={{ car.price }}</h2>
        <button @click="changebrand">点我修改品牌</button>
        <button @click="changeprice">点我修改价格</button>
        <button @click="changecar">点我修改整个car</button>
        <h1>情况四：监视【reactive】创建的【对象类型】数据</h1>
        <h2>name={{ me.name }}</h2>
        <h2>age={{ me.age }}</h2>
        <h2>mycar={{ me.car.c1 }},{{ me.car.c2 }}</h2>
        <button @click="changemyname">点我修改名字</button>
        <button @click="changemyage">点我修改年龄</button>
        <button @click="changemycar1">点我修改car1</button>
        <button @click="changemycar2">点我修改car2</button>
        <button @click="changemycar">点我修改整个car</button>
    </div>
        
</template>

<script lang="ts" setup name="Person123">
import {ref, watch, reactive} from 'vue'
let sum = ref(0)
let person=ref({
    name:'zouhaonan',
    age:18
})
let car = reactive({
    brand:'BMW',
    price:120
})

let me = reactive({
    name:'zhn',
    age:18,
    car:{
        c1:'BMW',
        c2:'Bentz'
    }
})

function addsum(){
    sum.value+=1
}
function changename(){
    person.value.name+='-'
}
function changeage(){
    person.value.age+=1
}
function changeperson(){
    if(person.value.name=='zhn'&&person.value.age==22){
        person.value={name:'ZHN',age:18}
    }
    else{
        person.value={name:'zhn',age:22}
    }
    
}

function changebrand(){
    car.brand+='+'
}
function changeprice(){
    car.price+=10
}
function changecar(){
    Object.assign(car,{brand:'Bentz',price:200})
}


function changemyname(){
    me.name+='='
}
function changemyage(){
    me.age+=1
}
function changemycar1(){
    me.car.c1='Yadi'
}
function changemycar2(){
    me.car.c2='Aima'
}

//注意这里reactive虽然不能直接赋值整个me对象,但是
//car是其内部的元素对象，可以直接复制，可以不用Object.assign()
function changemycar(){
    me.car={c1:'Auto',c2:'Mazida'}
}


//情况一：监视【ref】创建的【基本类型】数据
// const stopwatch=watch(sum,(newvalue, oldvalue)=>{
//     console.log('sum changed..',newvalue, oldvalue);
//     if(newvalue>10){
//         stopwatch()
//     }
// })

//情况二：监视【ref】创建的【对象类型】数据
//如果需要同时监听对象内的元素，【需要手动设置deep:true】
// watch(person,(newvalue,oldvalue)=>{
//     console.log('person changed...',newvalue,oldvalue);
    
// },{deep:true})

//情况三：监视【reactive】创建的【对象类型】数据
//相比于ref，reactive【隐式创建深层监听】，且无法关闭
// watch(car,(newvalue,oldvalue)=>{
//     console.log('car变化了',newvalue,oldvalue);
    
// })

//情况四：用【函数返回值】监视对象内部具体的属性，而不是监视整个reactive或ref对象
// watch(()=>me.name,(nv,ov)=>{
//     console.log('me.name发生了变化',nv,ov);
    
// })
// watch(()=>me.car,(n,o)=>{
//     console.log('me.car发生了变化',n,o);
    
// },{deep:true})

//情况五：用【数组包裹对象或基本数据】监视多个对象或基本类型
// watch([()=>me.name, ()=>me.car.c1],(n,o)=>{
//     console.log('me.name和me.car.c1发生变化',n,o);
    
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