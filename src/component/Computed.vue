<template>
    <div class="container">
        <div class="box">
            <ul>
                <li>
                    姓氏：<input type="text" v-model="firstname">
                </li>
                <li>名字：<input type="text" v-model="lastname"></li>
                <li>全名<span>{{ fullname }}</span></li>
            </ul>
            <button @click="changefullname">全名换成英文</button>
        </div>
        <div class="computer">
            请输入x:<input type="text" v-model="x"><br>
            请选择操作:
            <!-- <input type="radio" name="+" value="+" v-model="operator" checked>+
            <input type="radio" name="-" value="-" v-model="operator">-
            <input type="radio" name="*" value="*" v-model="operator">*
            <input type="radio" name="/" value="/" v-model="operator">/
             -->
            <select name="operator" id="dropdown" v-model="operator">
                <option value="+">加</option>
                <option value="-">减</option>
                <option value="*">乘</option>
                <option value="/">除</option>
            </select>
            <br>
            请输入y:<input type="text" v-model="y">
            <br>
            <span>{{ x }}{{operator}}{{y}}等于{{ result }}</span>
            
            <br>
            <h2>颜色提取</h2>
            <div class="colormap">
                <input type="color">
            </div>
            <div class="colorvar">
                <input type="range">
            </div>
        </div>
    </div>

    <hr>
</template>

<script lang="ts" setup name="Box">
import { computed, ref } from 'vue'
// import { Reactive } from 'vue'
let firstname = ref('邹')
let lastname = ref('浩男')
// let fullname = ref(firstname.value+lastname.value)

let fullname = computed({
    get(){
        return firstname.value+lastname.value
    },
    set(val){
        let x= val.split('-')
        firstname.value=x[0]
        lastname.value=x[1]
    }
    
})

function changefullname(){
    fullname.value='zou-haonan'
}
console.log(firstname.value, lastname.value);


//计算器
let x = ref(1.0)
let y = ref(1.0)
let operator = ref('+')
let result = computed(
    function () {
        switch (operator.value) {
            case '+':
                return Number(x.value) + Number(y.value)
            case '-':
                return Number(x.value) - Number(y.value)
            case '*':
                return Number(x.value) * Number(y.value)
            case '/':
                if (y.value == 0) {
                    alert('除数不能为0!')
                } else {
                    return Number(x.value) / Number(y.value)
                }

            default:
                break;
        }
    }
)

</script>

<!-- 声明局部样式scoped，选择器仅识别本组件内的标签元素，
 避免影响到别的组件的标签元素 -->
<style scoped>
.container {

    padding-left: 50px;
    padding-right: 50px;
}

.box,
.computer {
    /* position: relative; */
    /* height: 300px; */
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
    left: 50px;
    /* margin-left: 50px;  */
}
</style>