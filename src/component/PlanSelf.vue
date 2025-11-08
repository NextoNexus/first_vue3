<template>
    <div class="container">
        <!-- 头部（用户名、搜索框、新建项目、项目类型按钮,项目面板） -->
        <Header></Header>
        <!-- 内容 -->
        <div class="content">
            <!-- 跟进记录和变更记录表 -->
            <div class="record-table">
                <FollowRecord/>
                <changeRecord/>
            </div>
            <!-- 项目进度 -->
            <Progress></Progress>
        </div>
    </div>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import FollowRecord from "./FollowRecord.vue";
import changeRecord from "./changeRecord.vue";
import Progress from "./Progress.vue";

</script>

<style scoped>
.container {
    max-width: 1600px;
    min-height: 768px;
    margin: 0 auto;
    margin-bottom: .24rem;
}
.content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 7.68rem;
    width: 15.5rem;
    border-left: .01rem solid #7c68ee;
    border-bottom: .01rem solid #7c68ee;
    border-right: .01rem solid #7c68ee;
    border-bottom-left-radius: .08rem;
    border-bottom-right-radius: .08rem;
    overflow: hidden;
    
}
.record-table{
    height:100%;
    width: 12.08rem;
    border-right: .01rem solid #7c68ee;
}



</style>