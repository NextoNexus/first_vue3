<template>
    <div class="box" v-if="props.optionNodes.length>0">
        <el-select v-model="localData.selectedNodeId" @change="handleChange">
            <el-option v-for="node in props.optionNodes" :label="node.label" :value="node.id"></el-option>
        </el-select>
    </div>

</template>
<script setup lang="ts">
import { reactive, watch } from 'vue';
interface TreeNode {
    id: string;
    pid: string;
    label: string;
    children: TreeNode[];
}
const emit = defineEmits(['selected-node-changed']);
const props = defineProps<{
    optionNodes: TreeNode[];
    wholeTree:TreeNode;
}>()
const localData = reactive({
    selectedNodeId: null,
    subNodes: [] as TreeNode[],
})
defineExpose([localData]);

const handleChange = (value:any)=>{
    localData.subNodes = getSubNodes(props.wholeTree,value);
    emit('selected-node-changed',value);
}
const getSubNodes = (tree:TreeNode, id:any)=>{
 return [];
}
</script>
<style scoped lang="less"></style>