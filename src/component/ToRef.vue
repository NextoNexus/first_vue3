<template>
    <div class="container">
        <div class="ToRef">
            <h2>一辆{{ car.brand }}车</h2>
            <h2>价格为{{ car.price }}万</h2>
            <button @click="changename">changename</button>
            <button @click="changeprice">changeprice</button>
        </div>
    </div>

    <hr>
</template>

<script lang="ts" setup name="ToRef">
    import { reactive, toRefs } from 'vue'
    // import { Reactive } from 'vue'
    let car = reactive({ 
        brand: 'BMW', 
        price: 100 ,
        address: 'chengdu'
    })

    let {brand, price, address} = toRefs(car)
    function changename() {
        brand.value+='-'
        // brand.value+='-'
    }
    function changeprice() {
        price.value+=20
        // price.value+=20
    }
    

</script>

<!-- 声明局部样式scoped，选择器仅识别本组件内的标签元素，
 避免影响到别的组件的标签元素 -->
<style scoped>
.container{

    padding-left: 50px;
    padding-right: 50px;
}
.ToRef {
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
    left: 50px;
    /* margin-left: 50px;  */
}


</style>