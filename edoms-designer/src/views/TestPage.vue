<template>
  <div>
    <GridList ref="gridList" class="test" column-gap="20px" row-gap="20px" :page-size="5" :request="loadData">
      <template #default="{ item }">
        <div class="item">
          {{ item }}
        </div>
      </template>
      <template #loading>
        <p>加载中....</p>
      </template>
      <template #noMore>
        <p>没有更多了</p>
      </template>
    </GridList>
    <el-button @click="refreshGridList">强制刷新</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { listApplications } from '@/api/application';
import GridList, { GridListItem, RequestFunc } from '@/components/GridList.vue';

const gridList = ref();

const loadData: RequestFunc = async ({ pageSize, current }) => {
  const { dataList, count } = await listApplications({ page: current, limit: pageSize });
  return {
    data: dataList as GridListItem[],
    total: Number(count),
  };
};

const refreshGridList = () => {
  gridList.value?.reload();
};
</script>

<style lang="scss" scoped>
.test {
  height: 200px;
}
.item {
  background-color: aqua;
}
</style>
