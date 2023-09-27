<template>
  <div class="legend-wrapper">
    <div v-for="item in legendAssign" :key="item.name" class="legend">
      <span class="legend-shpae" :style="item.style"></span>
      <span class="legend-name" :style="{ color: item.style.color }">{{ item.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import useI18n from '../../../useI18n';
import { MEnergyMonitoring } from '../type';

const { t } = useI18n();

const props = defineProps<{
  config: MEnergyMonitoring;
}>();

const legend = ref([
  {
    name: t('较差'),
    type: 'medium',
    shape: 'block',
    style: {
      width: '16px',
      height: '16px',
      color: '#AEB0B3',
      backgroundColor: 'yellow',
    },
  },
  {
    name: t('优秀'),
    type: 'excellent',
    shape: 'block',
    style: {
      width: '16px',
      height: '16px',
      color: '#AEB0B3',
      backgroundColor: 'green',
    },
  },
  {
    name: t('参考值'),
    type: 'reference',
    shape: 'line',
    style: {
      width: '2px',
      height: '16px',
      color: '#AEB0B3',
      backgroundColor: 'white',
    },
  },
]);

const legendAssign = computed(() => {
  if (!props.config) {
    return legend.value;
  }
  legend.value.forEach((item) => {
    if (Object.keys(props.config).includes(item.type)) {
      item.style.backgroundColor = props.config[item.type][0]?.color || item.style.backgroundColor;
    }
  });
  return legend.value;
});
</script>

<style lang="scss" scoped>
.legend-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  .legend {
    display: flex;
    align-items: center;

    & > span {
      display: inline-block;
      margin: 0 5px;
    }
  }
}
</style>
