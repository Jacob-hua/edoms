<template>
  <img ref="imgRef" :src="imgSrc" />
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { formatPrecision } from '@edoms/utils';

import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import apiFactor from './api';
import { IndicatorData, MGlobalSchematic, MIndicatorItemConfig, ParameterItem } from './type';

const props = defineProps<{
  config: MGlobalSchematic;
}>();

const { request } = useApp(props);

const { fetchIndicatorData } = apiFactor(request);

const imgRef = ref<HTMLImageElement>();

const imgSrc = ref(props.config.src);

const imgFileUrl = ref<string>('');

const indicatorData = ref<IndicatorData>({});

const indicatorConfigs = computed<MIndicatorItemConfig[]>(() => props.config.indicators ?? []);

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 1000;
  }
  return props.config.intervalDelay;
});

watch(
  () => props.config.src,
  (value: any) => {
    if (!value) {
      imgSrc.value = 'https://puui.qpic.cn/vupload/0/1573555382625_bhp0wud8l6w.png/0';
      return;
    }

    const url = value[0].url;
    const suffix = value[0].fileSuffix;
    imgFileUrl.value = url;
    imgSrc.value = `${window.location.origin}/static/${url}${suffix}`;
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
    indicatorData.value[indicatorConfig.label] = {
      dataValue: Number(formatPrecision(dataValue, indicatorConfig.precision)),
      deviceCode,
      propCode,
    };
  });
};

useIntervalAsync(updateIndicatorsData, intervalDelay.value);

onMounted(() => {
  imgRef.value?.addEventListener('error', handleImgError);
});

onUnmounted(() => {
  imgRef.value?.removeEventListener('error', handleImgError);
});

function handleImgError() {
  // TODO: 此处应该通过配置文件来配置请求路径
  imgSrc.value = `http://k8s.isiact.com/edoms-designtime-service-dev/edoms/design-time/file/preview/?contentId=${imgFileUrl.value}`;
}
</script>
