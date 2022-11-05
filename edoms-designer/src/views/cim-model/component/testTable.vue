<template>
  <Table
    ref="table"
    :page-info="pageInfo"
    border
    :columns="column"
    :request="getData"
    :selection-change="selectChange"
    fixed="right"
  >
    <template #operate="scope">
      <el-button type="primary" @click="handleEdit(scope)"> 编辑</el-button>
      <el-button type="danger"> 删除</el-button>
    </template>
  </Table>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { listApplications } from '@/api/application';
import { ListApplicationsRes } from '@/api/application/type';

import Table from './Table.vue';
const table = ref(null);
const column = [
  {
    colAttr: {
      type: 'selection',
    },
  },
  {
    colAttr: {
      prop: 'createTime',
      label: '创建时间',
    },
  },
  {
    colAttr: {
      prop: 'name',
      label: '姓名',
    },
  },
  {
    colAttr: {
      prop: 'applicationId',
      label: '应用id',
    },
  },
  {
    colAttr: {
      prop: 'thumbnailId',
      label: 'id',
    },
  },
];
const pageInfo = ref({
  page: 1,
  limit: 10,
  total: 0,
});
const getData = async ({ page, limit }: { page: number; limit: number }) => {
  const { dataList, count }: ListApplicationsRes = await listApplications({
    page,
    limit,
  });
  pageInfo.value.total = Number(count);
  dataList.forEach((item: any) => {
    item.readOnly = true;
  });
  return dataList;
};
const handleEdit = (scope: any) => {
  console.log(scope);
};
const selectChange = (data: any) => {
  console.log('选中了');
  console.log(data);
};
</script>
