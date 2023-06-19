<template>
  <div class="wrapper">
    <div class="echart">{{ t('电流') }}</div>
    <EdomsCharts class="charts" :option="option"></EdomsCharts>
  </div>
</template>

<script lang="ts" setup>
import useLocales from 'packages/shenneng-ui/src/useLocales';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
const { t } = useLocales();

defineProps<{
  option: ECOption;
}>();
</script>

<style lang="scss" scoped>
.wrapper {
  margin: auto;

  .echart {
    margin-left: 22px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #eaf5ff;
  }

  .charts {
    width: 487px;
    height: 276px;
  }
}
</style>
