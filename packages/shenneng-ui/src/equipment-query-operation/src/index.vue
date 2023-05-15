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
import { computed, onMounted, ref, watch } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import TableList from './components/TableList.vue';
import TabList from './components/TabList.vue';
import apiFactory from './api';
import { EqDataList } from './type';

const props = defineProps<{
  config: EqDataList;
}>();

const indicatorConfigs = computed<EqDataList[]>(() => props.config.indicators ?? []);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});
const { request } = useApp(props);
const { fetchRealData } = apiFactory(request);
const tableWrapper = ref<any>(null);

const handlerToOperate = (itm: { [key: string]: any }) => {
  tableWrapper.value.changeType(itm);
};

watch(
  () => props.config.equipmentTypeList,
  () => {
    tableWrapper.value.changeType(props.config.equipmentTypeList[0]);
  }
);

// 请求数据
const updateParameterData = async () => {
  const dataCodes: string[] = indicatorConfigs.value.map(({ property }): string => property);
  if (dataCodes.length === 0) {
    return;
  }
  console.log(dataCodes);
  const result = await fetchRealData({ dataCodes });
  console.log(result);
};
useIntervalAsync(updateParameterData, intervalDelay.value);
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
