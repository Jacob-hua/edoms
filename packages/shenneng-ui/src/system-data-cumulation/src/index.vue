<template>
  <BusinessCard title="系统累计数据" subtitle="System cumulative data" min-width="522" min-height="367">
    <div class="warning-table-list">
      <TabList :list="props.config.dateTypeList" @operate="handlerToOperate" />
      <TableList ref="tableWrapper" :table-title-list="props.config.tableTitleList" />
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import BusinessCard from '../../BusinessCard.vue';

import TableList from './components/TableList.vue';
import TabList from './components/TabList.vue';
import { queryConfigs } from './type';

const props = defineProps<{
  config: queryConfigs;
}>();

const tableWrapper = ref<any>(null);

const handlerToOperate = (itm: { [key: string]: any }) => {
  tableWrapper.value.changeType(itm);
};
</script>

<style lang="scss" scoped>
.warning-table-list {
  width: 100%;
  height: 100%;
}
</style>
