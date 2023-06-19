<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-24 11:45:45
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-25 16:01:29
-->
<template>
  <div class="wrapper">
    <div class="echart" style="width: 485px">{{ t('负载率') }}</div>
    <EdomsCharts class="charts" :option="option"></EdomsCharts>
  </div>
</template>

<script lang="ts" setup>
import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import useI18n from '../../../useI18n';
const { t } = useI18n();

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
