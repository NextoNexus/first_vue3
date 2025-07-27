<template>
    <div class="container">
        <div class="Car">
            <h2>一辆{{ car.brand }}车</h2>
            <h2>价格为{{ car.price }}万</h2>
            <button @click="changePrice">addPrice</button>
            <button @click="changeCar">editCar</button>

            <ul>
                <li v-for="g in games" :key="g.id">
                    {{ g.name }}
                    <button @click="editGameName(this)">editName</button>
                </li>

            </ul>
        </div>

        <div class="left col">上联</div>
        <div class="right col">下联</div>
    </div>
    <h2>1234254</h2>
    <h3>qwesdfasdfas r</h3>
    <h3>rtusafsu</h3>
    <hr>
</template>

<script lang="ts" setup name="Car">
    import { reactive, ref } from 'vue'
    // import { Reactive } from 'vue'
    let car = reactive({ brand: 'BMW', price: 100 })
    let games = ref([
        { id: 'asdfsadf', name: '王者荣耀' },
        { id: 'jlskjdf', name: '原神' },
        { id: 'ncniwe', name: 'CS' }
    ])
    console.log(car)
    console.log('games:', games);


    function changePrice() {
        car.price += 1
    }
    function editGameName(btn) {
        console.log(btn);
        if (games.value[0].name == 'QQ飞车') {
            games.value[0].name = '王者荣耀'
        } else {
            games.value[0].name = 'QQ飞车'
        }

    }
    function changeCar() {
        let newcar={brand:'Yadi',price:20}
        Object.assign(car,newcar)
        console.log('car:',car);

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