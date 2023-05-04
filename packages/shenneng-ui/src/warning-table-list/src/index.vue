<template>
  <BusinessCard title="告警管理" subtitle="Alarm management" min-width="480" min-height="367">
    <div class="warning-table-list">
      <TabList :list="props.config.warningTypeList" @operate="handlerToOperate" />
      <TableList
        ref="tableWrapper"
        :table-title-list="props.config.tableTitleList"
        :warning-type-list="props.config.warningTypeList"
      />
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import BusinessCard from '../../BusinessCard.vue';

import TableList from './components/TableList.vue';
import TabList from './components/TabList.vue';
import { warningConfigs } from './type';

const props = defineProps<{
  config: warningConfigs;
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
  padding: 0 10px;
}
</style>
