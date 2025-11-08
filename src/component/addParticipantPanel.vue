<template>
  <div class="root-node">
    <el-input v-model="localData.treeData.label" readonly></el-input>
    <div class="select-forms">
      <selectForms
        :optionsList="localData.optionsList"
        :nodeIdPath="localData.nodeIdPath"
        @current-nodeId-updated="handleNodeIdChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import SelectForms from "./SelectForms.vue";

interface TreeNode {
  id: string;
  pid: string;
  label: string;
  children: TreeNode[];
}
const localData = reactive({
  treeData: {} as TreeNode,
  currentNode: {} as Omit<TreeNode, "children">,
  optionsList: [] as Array<Array<Omit<TreeNode, "children">>>,
  nodeIdPath: [] as Array<string>,
});

// 在 addParticipantPanel.vue 的 script 部分

// 根据节点id查找节点对象
const findNode = (tree: TreeNode, nodeId: string): TreeNode | null => {
  if (!tree || !nodeId) return null;

  if (tree.id === nodeId) {
    return tree;
  }

  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const found = findNode(child, nodeId);
      if (found) return found;
    }
  }

  return null;
};

// 查找树的根节点到当前节点的路径
const getNodeIdPath = (tree: TreeNode, nodeId: string): Array<string> => {
  const path: Array<string> = [];

  const findPath = (node: TreeNode, targetId: string): boolean => {
    path.push(node.id);

    if (node.id === targetId) {
      return true;
    }

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        if (findPath(child, targetId)) {
          return true;
        }
      }
    }

    path.pop();
    return false;
  };

  findPath(tree, nodeId);
  
  // 移除根节点
  path.shift();

  // 如果当前节点不是叶子节点，则在路径末尾添加null
  const currentNode = findNode(tree, nodeId);
  if (currentNode && currentNode.children && currentNode.children.length > 0) {
    path.push(null as any);
  }

  return path;
};

// 根据节点id路径数组获取兄弟节点数组
const getOptionsList = (
  tree: TreeNode,
  nodeIdPath: Array<string>
): Array<Array<Omit<TreeNode, "children">>> => {
  const optionsList: Array<Array<Omit<TreeNode, "children">>> = [];
  let currentLevel = tree;

  // 处理路径中的每个节点
  for (let i = 0; i < nodeIdPath.length; i++) {
    const nodeId = nodeIdPath[i];
    
    // 跳过null节点，它只是占位符
    if (nodeId === null) continue;

    // 获取当前层级的兄弟节点（包括当前节点）
    const siblings = currentLevel.children
      ? currentLevel.children.map((child) => ({
          id: child.id,
          pid: child.pid,
          label: child.label,
        }))
      : [];

    optionsList.push(siblings);

    // 继续深入下一层
    const nextNode = currentLevel.children?.find(
      (child) => child.id === nodeId
    );
    if (nextNode) {
      currentLevel = nextNode;
    }
  }

  // 如果最后一个节点不是叶子节点，则添加其子节点作为选项
  if (currentLevel.children && currentLevel.children.length > 0) {
    const childrenOptions = currentLevel.children.map((child) => ({
      id: child.id,
      pid: child.pid,
      label: child.label,
    }));
    optionsList.push(childrenOptions);
  }
  
  return optionsList;
};

// 处理选择框的节点id变化
const handleNodeIdChange = (nodeId: string) => {
  // 更新当前节点
  localData.currentNode = findNode(localData.treeData, nodeId) as Omit<
    TreeNode,
    "children"
  >;

  // 更新节点路径
  localData.nodeIdPath = getNodeIdPath(localData.treeData, nodeId);

  // 更新选项列表
  localData.optionsList = getOptionsList(
    localData.treeData,
    localData.nodeIdPath
  );
};
onMounted(() => {
  localData.treeData = {
    id: "1",
    pid: "",
    label: "根节点",
    children: [
      {
        id: "2",
        pid: "1",
        label: "部门A",
        children: [
          {
            id: "5",
            pid: "2",
            label: "团队A1",
            children: [
              {
                id: "11",
                pid: "5",
                label: "小组A1-1",
                children: [
                  {
                    id: "17",
                    pid: "11",
                    label: "成员A1-1-1",
                    children: [
                      {
                        id: "23",
                        pid: "17",
                        label: "叶子节点A1-1-1-1",
                        children: [],
                      },
                      {
                        id: "24",
                        pid: "17",
                        label: "叶子节点A1-1-1-2",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: "18",
                    pid: "11",
                    label: "成员A1-1-2",
                    children: [
                      {
                        id: "25",
                        pid: "18",
                        label: "叶子节点A1-1-2-1",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: "12",
                pid: "5",
                label: "小组A1-2",
                children: [
                  {
                    id: "19",
                    pid: "12",
                    label: "成员A1-2-1",
                    children: [
                      {
                        id: "26",
                        pid: "19",
                        label: "叶子节点A1-2-1-1",
                        children: [],
                      },
                      {
                        id: "27",
                        pid: "19",
                        label: "叶子节点A1-2-1-2",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "6",
            pid: "2",
            label: "团队A2",
            children: [
              {
                id: "13",
                pid: "6",
                label: "小组A2-1",
                children: [
                  {
                    id: "20",
                    pid: "13",
                    label: "成员A2-1-1",
                    children: [
                      {
                        id: "28",
                        pid: "20",
                        label: "叶子节点A2-1-1-1",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "3",
        pid: "1",
        label: "部门B",
        children: [
          {
            id: "7",
            pid: "3",
            label: "团队B1",
            children: [
              {
                id: "14",
                pid: "7",
                label: "小组B1-1",
                children: [
                  {
                    id: "21",
                    pid: "14",
                    label: "成员B1-1-1",
                    children: [
                      {
                        id: "29",
                        pid: "21",
                        label: "叶子节点B1-1-1-1",
                        children: [],
                      },
                      {
                        id: "30",
                        pid: "21",
                        label: "叶子节点B1-1-1-2",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "8",
            pid: "3",
            label: "团队B2",
            children: [
              {
                id: "15",
                pid: "8",
                label: "小组B2-1",
                children: [
                  {
                    id: "22",
                    pid: "15",
                    label: "成员B2-1-1",
                    children: [
                      {
                        id: "31",
                        pid: "22",
                        label: "叶子节点B2-1-1-1",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "4",
        pid: "1",
        label: "部门C",
        children: [
          {
            id: "9",
            pid: "4",
            label: "团队C1",
            children: [
              {
                id: "16",
                pid: "9",
                label: "小组C1-1",
                children: [
                  {
                    id: "32",
                    pid: "16",
                    label: "成员C1-1-1",
                    children: [
                      {
                        id: "33",
                        pid: "32",
                        label: "叶子节点C1-1-1-1",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "10",
            pid: "4",
            label: "团队C2",
            children: [
              {
                id: "34",
                pid: "10",
                label: "小组C2-1",
                children: [
                  {
                    id: "35",
                    pid: "34",
                    label: "成员C2-1-1",
                    children: [
                      {
                        id: "36",
                        pid: "35",
                        label: "叶子节点C2-1-1-1",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  localData.currentNode = {
    id: "35",
    pid: "34",
    label: "成员C2-1-1",
  };
  localData.nodeIdPath = getNodeIdPath(
    localData.treeData,
    localData.currentNode.id
  );
  console.log("nodeIdPath:", localData.nodeIdPath);

  localData.optionsList = getOptionsList(
    localData.treeData,
    localData.nodeIdPath
  );
  console.log("optionsList", localData.optionsList);
});
</script>
<style scoped></style>
