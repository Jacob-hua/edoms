<template>
  <div>
    <div>可编辑表格测试</div>
    <EditTable ref="editTable" :data-source="data">
      <EditTableColumn prop="name" label="姓名" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
        <template #edit="{ row }">
          <el-input v-model="row.name" />
        </template>
      </EditTableColumn>
      <EditTableColumn prop="age" label="年龄" :rules="[{ required: true, message: '请输入年龄', trigger: 'blur' }]">
        <template #edit="{ row }">
          <el-input v-model="row.age" />
        </template>
      </EditTableColumn>
      <EditTableColumn label="操作">
        <template #default="{ actions, $index }">
          <el-button type="primary" @click="handleEdit(actions, $index)">编辑</el-button>
          <el-button type="primary" @click="handleDelete(actions, $index)">删除</el-button>
        </template>
        <template #edit="{ $index, actions }">
          <el-button type="primary" @click="handleSave(actions, $index)">保存</el-button>
          <el-button type="primary" @click="handleCancel(actions, $index)">取消</el-button>
        </template>
      </EditTableColumn>
    </EditTable>
    <el-button @click="handleAdd">新增</el-button>
    <el-button @click="handleNewData">获取新数据</el-button>
    {{ resultData }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EditTable from '@/components/EditTable.vue';
import EditTableColumn from '@/components/EditTableColumn.vue';

const data = [
  {
    id: 0,
    name: '张三',
    age: 12,
  },
  {
    id: 1,
    name: '李子',
    age: 12333,
  },
];

const editTable = ref<any | null>(null);

const resultData = ref<any[]>([]);

const handleEdit = (actions: any, index: number) => {
  actions.startEditable(index);
};
const handleDelete = (actions: any, index: number) => {
  actions.deleteRow(index);
};
const handleCancel = (actions: any, index: number) => {
  actions.cancelEditable(index);
};
const handleSave = (actions: any, index: number) => {
  actions.saveEditable(index);
};
const handleAdd = () => {
  if (!editTable.value) {
    return;
  }
  editTable.value.editActions.addRow();
};
const handleNewData = () => {
  if (!editTable.value) {
    return;
  }
  resultData.value = editTable.value.resultData;
};
</script>
