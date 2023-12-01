<template>
  <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="392" min-height="272">
    <template #operation>
      <TabList @operate="handlerToOperate" />
    </template>
    <div class="warning-table-list">
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
import { ExecuteComparsionData, MCumulativeConfig } from './type';

const props = defineProps<{
  config: MCumulativeConfig;
}>();
const { setMessage, t } = useApp(props);

setMessage(locales);
const { request } = useApp(props);

const { fetchExecuteApi } = apiFactory(request);

const tableWrapper = ref<any>(null);

const active = ref<{ [key: string]: any }>({
  key: t('日'),
  value: 'd',
});

const systemCumulativeData = ref<ExecuteComparsionData[]>([]);

//点位属性
const propertys = computed(() => props.config.category?.map(({ property }: { property: string }) => property));

//点位名称
const names = computed(() => props.config.category?.map(({ label }: { label: string }) => label));

//calculateType
const calculateType = computed(() => props.config.category?.[0].calculateType);

//轮询间隔
const intervalDelay = computed<number>(() =>
  typeof props.config.intervalDelay !== 'number' ? 10 : props.config.intervalDelay
);

const getSystemCumulativeData = async () => {
  if (!propertys.value || propertys.value.length <= 0) return;
  const requestParam = {
    codes: propertys.value.join(',') as string,
    names: names.value.join(',') as string,
    calculateType: calculateType.value,
    dateType: active.value.value,
  };
  const result = await fetchExecuteApi({ apiCode: 'queryCumulativeData', requestParam });
  if (!result || result.length <= 0) return;
  result.forEach(({ code, value, qoqRatio, qoqTrend, yoyRatio, yoyTrend }) => {
    systemCumulativeData.value.forEach((item) => {
      if (item.property === code) {
        item.value = String(formatPrecision(Number(value), item.precision));
        item.qoqRatio = String(formatPrecision(Number(qoqRatio), item.ratioPrecision));
        item.qoqTrend = qoqTrend;
        item.yoyRatio = String(formatPrecision(Number(yoyRatio), item.ratioPrecision));
        item.yoyTrend = yoyTrend;
      }
    });
  });
};

const handlerToOperate = (itm: { [key: string]: any }) => {
  tableWrapper.value.changeType(itm.key);
  active.value = itm;
  getSystemCumulativeData();
};

const categories = computed(() => props.config.category ?? []);
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
      code: item.property,
      name: item.label,
      value: 0,
      dataValue: '--',
      qoqRatio: '--',
      qoqTrend: 'flat',
      yoyRatio: '--',
      yoyTrend: 'flat',
    }));
    console.log('systemCumulativeData.value', systemCumulativeData.value);
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
  padding: 15px;
  overflow-y: scroll;
}
</style>
