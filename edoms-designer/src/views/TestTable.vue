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
</script>
