<template>
  <BusinessCard :title="props.config.title" :subtitle="props.config.subTitle" min-width="522" min-height="261">
    <div class="warning-table-list">
      <!-- :list="props.config.equipmentTypeList" -->
      <TabList :list="props.config.equipmentTypeList" @operate="handlerToOperate" />
      <TableList ref="tableWrapper" />
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

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

watch(
  () => props.config,
  (props) => {
    tableWrapper.value.changeType(props.equipmentTypeList[0]);
  }
);

onMounted(() => {
  if (props.config.equipmentTypeList && props.config.equipmentTypeList[0]) {
    handlerToOperate(props.config.equipmentTypeList[0]);
  }
});

console.log(props);
</script>

<style lang="scss" scoped>
.warning-table-list {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
