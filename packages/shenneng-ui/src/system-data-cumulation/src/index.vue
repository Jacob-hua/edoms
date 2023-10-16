<template>
  <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="522" min-height="367">
    <div class="warning-table-list">
      <TabList :tab-data="tabData" @operate="handlerToOperate" />
      <TableList ref="tableWrapper" :table-data="systemCumulativeData" />
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { formatPrecision } from '@edoms/utils';
import { formatDateRange } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import TableList from './components/TableList.vue';
import TabList from './components/TabList.vue';
import apiFactory from './api';
import locales from './locales';
import { FetchSysCumulantData, FetchSysCumulantDataReq, MCumulativeConfig } from './type';

type SdateType = 'd' | 'm' | 'y';

const props = defineProps<{
  config: MCumulativeConfig;
}>();

const { setMessage, t } = useApp(props);

setMessage(locales);
const { request } = useApp(props);

const { fetchSysCumulantData } = apiFactory(request);

const tableWrapper = ref<any>(null);

const active = ref<{ [key: string]: any }>({
  key: t('日'),
  value: 'd',
});

const systemCumulativeData = ref();

const tabData = computed(() => props.config.specificDate ?? []);

const intervalDelay = computed<number>(() =>
  typeof props.config.intervalDelay !== 'number' ? 10 : props.config.intervalDelay
);

const currentInstanceProperty = computed(() => {
  return {
    instanceType: props.config.instanceType,
    instance: props.config.instance[0],
    propertyType: props.config.propertyType,
    property: props.config.property,
    precision: props.config.precision,
    ratioPrecision: props.config.ratioPrecision,
    calculateType: props.config.calculateType,
  };
});

const transDateMap = (date: SdateType): any =>
  new Map([
    ['d', 'day'],
    ['m', 'month'],
    ['y', 'year'],
  ]).get(date);

const getSystemCumulativeData = async () => {
  if (!props.config || props.config.instance?.length <= 0) return;
  const { start, end } = formatDateRange(
    new Date(),
    transDateMap(active.value.value as SdateType),
    'YYYY-MM-DD HH:mm:ss'
  );
  const params: FetchSysCumulantDataReq = {
    startAt: start,
    endAt: end,
    calculateType: props.config.calculateType,
    identify: active.value.value,
    propCode: props.config.instance?.[0],
    jsonRule: props.config.jsonRule,
  };
  const result = await fetchSysCumulantData(params);
  if (!result || result.length <= 0) return;
  systemCumulativeData.value = result.map((item: FetchSysCumulantData) => {
    item.dataValue = formatPrecision(Number(item.dataValue), currentInstanceProperty.value.precision).toString();
    item.qoqRatio = formatPrecision(Number(item.qoqRatio), currentInstanceProperty.value.ratioPrecision).toString();
    item.yoyRatio = formatPrecision(Number(item.yoyRatio), currentInstanceProperty.value.ratioPrecision).toString();
    Object.assign(item, currentInstanceProperty.value);
    return item;
  });
};

const handlerToOperate = (itm: { [key: string]: any }) => {
  tableWrapper.value.changeType(itm.key);
  active.value = itm;
  getSystemCumulativeData();
};

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
