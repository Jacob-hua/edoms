<template>
  <img :src="imgSrc" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatPrecision } from '@edoms/utils';

import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import AltImg from './assets/alt.svg';
import apiFactory from './api';
import { IndicatorData, MGlobalSchematic, MIndicatorItemConfig, ParameterItem } from './type';

const props = defineProps<{
  config: MGlobalSchematic;
}>();

const { request, app } = useApp(props);

const node = app?.page?.getNode(props.config.id);

const { fetchIndicatorData } = apiFactory(request);

const imgSrc = ref<string>(AltImg);

const indicatorData = ref<IndicatorData>({});

const indicatorConfigs = computed<MIndicatorItemConfig[]>(() => props.config.indicators ?? []);

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

watch(
  () => props.config.src,
  (value: any[]) => {
    if (!value || value.length === 0) {
      imgSrc.value = AltImg;
      return;
    }
    imgSrc.value = app?.generateImageSrc(props.config.src[0]) ?? AltImg;
  },
  { immediate: true }
);

const updateIndicatorsData = async () => {
  const dataList: ParameterItem[] = indicatorConfigs.value.map(
    ({ instance, property }): ParameterItem => ({
      deviceCode: instance[instance.length - 1],
      propCodeList: [property],
    })
  );

  if (dataList.length === 0) {
    return;
  }

  const result = await fetchIndicatorData({ dataList });
  result.forEach(({ dataValue, deviceCode, propCode }) => {
    const targetIndex = indicatorConfigs.value.findIndex(
      ({ instance, property }) => instance[instance.length - 1] === deviceCode && property === propCode
    );
    if (targetIndex < 0) {
      return;
    }
    const indicatorConfig = indicatorConfigs.value[targetIndex];
    indicatorData.value[indicatorConfig.label] = Number(formatPrecision(dataValue, indicatorConfig.precision));
  });
  app?.emit('global-schematic:flush', node, indicatorData.value);
};

useIntervalAsync(updateIndicatorsData, intervalDelay.value);
</script>
