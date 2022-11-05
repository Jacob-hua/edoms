<template>
  <div class="static-container">
    <GridList
      ref="gridList"
      class="grid-list"
      column-gap="20px"
      row-gap="20px"
      item-min-width="200px"
      :request="loadData"
    >
      <template #default="{ item }">
        <div class="item">{{ item.name }}</div>
      </template>
      <template #noMore>
        <div></div>
      </template>
    </GridList>
    <div class="right-section">
      <StaticModelTable />
    </div>
  </div>
</template>

<script lang="ts" setup name="StaticModel">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import GridList, { RequestFunc } from '@/components/GridList.vue';

import StaticModelTable from './StaticModelTable.vue';

const route = useRoute();
console.log(route.query.applicationId);
const gridList = ref(null);
const loadData: RequestFunc<{ name: string }> = async () => {
  const dataSource = [
    {
      name: `模型表1`,
    },
    {
      name: '模型表2',
    },
    {
      name: '模型表3',
    },
    {
      name: '模型表4',
    },
  ];
  return {
    data: dataSource,
    total: dataSource.length,
  };
};
</script>

<style lang="scss" scoped>
.item {
  cursor: pointer;
  border-bottom: 1px solid #e1e1e1;
}
.static-container {
  display: flex;
  .grid-list {
    height: 700px;
    width: 15%;
    border-right: 1px solid #e1e1e1;
    div {
      text-align: left;
    }
  }
  .right-section {
    width: 85%;
  }
}
</style>
