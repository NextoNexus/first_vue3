<template>
  <div class="select-boxes" v-for="(options, index) in props.optionsList">
    <el-select v-model="localData.nodeIdPath[index]" @change="handleChange">
      <el-option
        v-for="option in options"
        :label="option.label"
        :value="option.id"
      ></el-option>
    </el-select>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from "vue";
interface TreeNode {
  id: string;
  pid: string;
  label: string;
  children: TreeNode[];
}
const emit = defineEmits(["current-nodeId-updated"]);
const props = defineProps<{
  optionsList: Array<Array<Omit<TreeNode, "children">>>;
  nodeIdPath: Array<string>;
}>();
const localData = reactive({
  nodeIdPath: [],
});
const handleChange = (value: any) => {
  console.log("value:", value);
  // 触发父组件更新
  emit("current-nodeId-updated", value);
};
watch(
  () => props.nodeIdPath,
  (newvalue) => {
    localData.nodeIdPath = newvalue;
  }
);
</script>
<style scoped lang="less"></style>
