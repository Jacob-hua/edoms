<template>
  <div>
    <div>可编辑表格测试</div>
    <EditTable :data-source="data">
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
        <template #default="{ actions, row }">
          <el-button type="primary" @click="handleEdit(actions, row)">编辑</el-button>
          <el-button type="primary" @click="handleDelete(actions, row)">删除</el-button>
        </template>
        <template #edit="{ row, actions }">
          <el-button type="primary" @click="handleSave(actions, row)">保存</el-button>
          <el-button type="primary" @click="handleCancel(actions, row)">取消</el-button>
        </template>
      </EditTableColumn>
    </EditTable>
  </div>
</template>

<script lang="ts" setup>
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

const handleEdit = (actions: any, row: any) => {
  actions.startEditable(row);
};
const handleDelete = (actions: any, row: any) => {
  actions.deleteRow(row);
};
const handleCancel = (actions: any, row: any) => {
  actions.cancelEditable(row);
};
const handleSave = (actions: any, row: any) => {
  actions.saveEditable(row);
};
</script>
