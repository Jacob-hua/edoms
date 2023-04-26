<template>
  <BusinessCard title="设备运行参数" subtitle="Equipment operation parameters" min-width="522" min-height="261">
    <div class="warning-table-list">
      <!-- :list="props.config.equipmentTypeList" -->
      <TabList :list="props.config.equipmentTypeList" @operate="handlerToOperate" />
      <TableList ref="tableWrapper" />
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import BusinessCard from '../../BusinessCard.vue';

import TableList from './components/TableList.vue';
import TabList from './components/TabList.vue';
import { EqDataList } from './type';

const props = defineProps<{
  config: EqDataList;
}>();

const tableWrapper = ref<any>(null);

const handlerToOperate = (itm: { [key: string]: any }) => {
  tableWrapper.value.changeType(itm);
};

onMounted(() => {
  handlerToOperate(props.config.equipmentTypeList[0]);
});

console.log(props);
</script>

<style lang="scss" scoped>
.warning-table-list {
  width: 100%;
  height: 100%;
}
</style>
