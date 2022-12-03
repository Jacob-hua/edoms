<template>
  <div class="dynamic">
    <GridList
      ref="gridList"
      class="grid-list"
      column-gap="20px"
      row-gap="20px"
      :page-size="9999999"
      item-min-width="200px"
      :request="loadData"
    >
      <template #default="{ item }">
        <div :class="['item', item.id === tableData.id ? 'active' : '']" @click="handleChangeName(item)">
          {{ item.name }}
        </div>
      </template>
      <template #noMore>
        <div></div>
      </template>
    </GridList>
    <DynamicModelTable v-if="isShow" :key="tableData.id" :data="tableData" />
  </div>
</template>

<script lang="ts" setup name="DynamicModel">
import { ref } from 'vue';

import modelApi from '@/api/model';
import GridList from '@/components/GridList.vue';
import { ModelMark } from '@/const/model';

import DynamicModelTable from './DynamicModelTable.vue';
const gridList = ref(null);
const tableData = ref();
const isShow = ref<boolean>(false);

const loadData = async () => {
  const result: any = await modelApi.getDicData({
    mark: ModelMark.CIM_URL as string,
  });
  tableData.value = result[0];
  isShow.value = true;
  return {
    data: result,
    total: result.length,
  };
};
const handleChangeName = (model: any) => {
  tableData.value = model;
};
</script>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
}
.json {
  background-color: #e0e0e0;
  margin-top: 20px;
}
.item {
  cursor: pointer;
  border-bottom: 1px solid #e1e1e1;
}
.select {
  width: 115px;
}
.dynamic {
  height: 700px;
  overflow-y: auto;
  display: flex;
  .grid-list {
    width: 15%;
    text-align: left;
    height: 700px;
    border-right: 1px solid #e1e1e1;
  }
}
</style>
