<template>
  <div>
    <GmctEditor class="editor" :project="project" :editor-layout="editorLayout">
      <template #topBar></template>
    </GmctEditor>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EditorLayout, GmctEditor } from '@gmct/editor';

import { formatPrecision } from '@edoms/utils';

import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import apiFactory from './api';
import { IndicatorData, MGmctEditor, MIndicatorItemConfig, ParameterItem } from './type';

const DEFAULT_PROJECT = {
  id: '',
  name: '',
  gridType: 'mesh',
  gridSize: 25,
  gridColor: 'rgba(123, 123, 123, 0.49)',
  vertexes: [],
  links: [],
};

const props = defineProps<{
  config: MGmctEditor;
}>();

const { request, app } = useApp(props);

const node = app?.page?.getNode(props.config.id);

const { fetchIndicatorData } = apiFactory(request);

const project = ref<any>(DEFAULT_PROJECT);

const editorLayout = EditorLayout.Workspace;
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
  async (value: any[]) => {
    if (!value || value.length === 0) {
      project.value = DEFAULT_PROJECT;
      return;
    }

    const url = app?.generateImageSrc(props.config.src[0]);
    let result = DEFAULT_PROJECT;
    if (url) {
      const res = await fetch(url);
      result = await res.json();
    }
    project.value = result;
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

<style lang="scss">
.editor {
  width: 100%;
  height: 100%;
}
</style>
