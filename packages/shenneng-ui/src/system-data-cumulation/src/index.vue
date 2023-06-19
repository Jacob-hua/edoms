<template>
  <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="522" min-height="367">
    <div class="warning-table-list">
      <TabList @operate="handlerToOperate" />
      <TableList ref="tableWrapper" :table-data="systemCumulativeData" />
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';

import { formatPrecision } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import TableList from './components/TableList.vue';
import TabList from './components/TabList.vue';
import apiFactory from './api';
import locales from './locales';
import { Category, FetchCumulativeDataReq, MCumulativeConfig } from './type';

interface CumulativeList extends Category {
  dataValue: string;
  qoqRatio: string;
  qoqTrend: 'up' | 'down' | 'flat';
  yoyRatio: string;
  yoyTrend: 'up' | 'down' | 'flat';
}

const props = defineProps<{
  config: MCumulativeConfig;
}>();
const { setMessage } = useApp(props);

setMessage(locales);
const { request } = useApp(props);

const { fetchCumulativeData } = apiFactory(request);

const tableWrapper = ref<any>(null);

const active = ref<{ [key: string]: any }>({
  key: '日',
  value: 'day',
});

const systemCumulativeData = ref<CumulativeList[]>([]);

const categories = computed(() => props.config.category ?? []);

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const getSystemCumulativeData = async () => {
  if (!categories.value || categories.value.length <= 0) return;
  const params: FetchCumulativeDataReq = categories.value.map((item, index) => {
    return {
      dateRange: active.value.value,
      calculateType: item.calculateType,
      identify: index.toString(),
      propCode: item.property,
    };
  });
  const result = await fetchCumulativeData(params);
  if (!result || result.length <= 0) return;
  result.forEach(({ identify, dataValue, qoqRatio, qoqTrend, yoyRatio, yoyTrend }) => {
    const targetResult = systemCumulativeData.value[Number(identify)];
    targetResult.dataValue = String(formatPrecision(Number(dataValue), targetResult.precision));
    targetResult.qoqRatio = String(formatPrecision(Number(qoqRatio), targetResult.ratioPrecision));
    targetResult.qoqTrend = qoqTrend;
    targetResult.yoyRatio = String(formatPrecision(Number(yoyRatio), targetResult.ratioPrecision));
    targetResult.yoyTrend = yoyTrend;
  });
};

const handlerToOperate = (itm: { [key: string]: any }) => {
  tableWrapper.value.changeType(itm.key);
  active.value = itm;
  getSystemCumulativeData();
};

watch(
  () => categories.value,
  (categories) => {
    systemCumulativeData.value = categories.map((item) => ({
      label: item.label,
      instanceType: item.instanceType,
      instance: item.instance,
      propertyType: item.propertyType,
      property: item.property,
      precision: item.precision,
      ratioPrecision: item.ratioPrecision,
      unit: item.unit,
      calculateType: item.calculateType,
      dataValue: '--',
      qoqRatio: '--',
      qoqTrend: 'flat',
      yoyRatio: '--',
      yoyTrend: 'flat',
    }));
  },
  {
    immediate: true,
    deep: true,
  }
);

useIntervalAsync(getSystemCumulativeData, intervalDelay.value);
onMounted(() => {
  tableWrapper.value.changeType(active.value.key);
});
</script>

<style lang="scss" scoped>
.warning-table-list {
  width: 100%;
  height: 100%;
  padding: 0 10px;
}
</style>
