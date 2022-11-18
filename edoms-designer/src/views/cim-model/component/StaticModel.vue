<template>
  <div class="static-container">
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
        <div :class="['item', data.id && item.id === data?.id ? 'active item' : '']" @click="handleLoadTableData(item)">
          {{ item.name }}
        </div>
      </template>
      <template #noMore>
        <div></div>
      </template>
    </GridList>
    <div class="right-section">
      <StaticModelTable v-if="staticFlag" :data="data" />
    </div>
  </div>
</template>

<script lang="ts" setup name="StaticModel">
import { ref } from 'vue';

import { getDicData } from '@/api/model';
import GridList from '@/components/GridList.vue';
import { Mark } from '@/const/model-mark';

import StaticModelTable from './StaticModelTable.vue';

const gridList = ref(null);
const data = ref({
  id: '',
});
const loadData = async () => {
  const result: any = await getDicData({
    mark: Mark.CIM_TABLE as string,
  });
  data.value = result[0];
  staticFlag.value = true;
  return {
    data: result,
    total: result.length,
  };
};

const staticFlag = ref(false);

const handleLoadTableData = (model: any) => {
  data.value = model;
};
</script>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
}
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
