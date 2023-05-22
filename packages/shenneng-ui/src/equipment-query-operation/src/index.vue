<template>
  <BusinessCard :title="props.config.title" :subtitle="props.config.subTitle" min-width="522" min-height="261">
    <div class="warning-table-list">
      <!-- :list="props.config.equipmentTypeList" -->
      <TabList :list="props.config.equipmentTypeList" @operate="handlerToOperate" />
      <TableList ref="tableWrapper" @ct-index="handlerToctIndex" />
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
import { EqAllList, EqDataList } from './type';

const props = defineProps<{
  config: EqDataList;
}>();
// 一级菜单索引
const fristIndex = ref<number>(0);
// 二级菜单索引
const secondIndex = ref<number>(0);
// 当前点位code
const dataCodes: string[] = [];
// 当前点位对应数据
const indicatorConfigs = computed<EqAllList[]>(() => props.config.equipmentTypeList ?? []);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});
const { request } = useApp(props);
const { fetchRealData } = apiFactory(request);
const tableWrapper = ref<any>(null);

const handlerToOperate = (itm: { [key: string]: any }, val: number) => {
  console.log(itm);
  if (val === fristIndex.value) return;
  fristIndex.value = val;
  secondIndex.value = 0;
  // tableWrapper.value.changeType(itm, secondIndex.value);
  updateParameterData();
};
const handlerToctIndex = (val: number) => {
  secondIndex.value = val;
  updateParameterData();
};

watch(
  () => props.config.equipmentTypeList,
  () => {
    tableWrapper.value.changeType(props.config.equipmentTypeList[0], secondIndex.value);
  }
);

// 请求数据
const updateParameterData = async () => {
  if (indicatorConfigs.value.length === 0 || indicatorConfigs.value[fristIndex.value].equipmentList.length === 0) {
    return;
  }
  dataCodes.length = 0;
  indicatorConfigs.value[fristIndex.value].equipmentList[secondIndex.value].pointList?.forEach((item) => {
    dataCodes.push(item.property);
  });
  if (dataCodes.length === 0) {
    return;
  }
  const pointDataList = await fetchRealData({ dataCodes });
  pointDataList.forEach((item) => {
    indicatorConfigs.value[fristIndex.value].equipmentList[secondIndex.value].pointList?.forEach((element) => {
      if (item.propCode === element.property) {
        element.data = item.propVal;
      }
    });
  });
  tableWrapper.value.changeType(indicatorConfigs.value[fristIndex.value], secondIndex.value);
};
useIntervalAsync(updateParameterData, intervalDelay.value);
onMounted(() => {
  if (props.config.equipmentTypeList && props.config.equipmentTypeList[0]) {
    handlerToOperate(props.config.equipmentTypeList[0], 0);
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
