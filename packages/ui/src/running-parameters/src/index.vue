<template>
  <BusinessCard title="运行参数" min-width="1080" min-height="240">
    <template #operation>
      <el-tabs v-model="activeCategory">
        <el-tab-pane v-for="{ name, label } in categories" :key="name" :label="label" :name="name" />
      </el-tabs>
    </template>
    <div class="wrapper">
      <el-tabs class="left-tabs" tab-position="left">
        <el-tab-pane v-for="({ label }, index) in parameterConfigs" :key="index" :label="label" :name="index" />
      </el-tabs>
      <div>
        <edoms-charts width="908" height="240" :option="option" />
      </div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import BusinessCard from '../../BusinessCard.vue';

import { MRunningParameters } from './type';

const props = defineProps<{
  config: MRunningParameters;
}>();

const categories = ref([
  {
    label: '系统曲线',
    name: 'systems',
  },
  {
    label: '设备曲线',
    name: 'equipments',
  },
]);

const activeCategory = ref<string>('systems');

const parameterConfigs = computed<any[]>(() => {
  const result = props.config[activeCategory.value];
  if (result) {
    return result;
  }
  return [];
});

const option = {
  xAxis: {
    data: ['A', 'B', 'C', 'D', 'E'],
  },
  yAxis: {},
  series: [
    {
      data: [10, 22, 28, 23, 19],
      type: 'line',
      smooth: true,
    },
  ],
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
}
// ::v-deep .left-tabs {
//   & .el-tabs__item {
//     width: 120px;
//     text-align: center;
//   }
//   & .el-tabs__item.is-active {
//     background-color: #333333;
//   }
// }
// ::v-deep .el-tabs__header {
//   margin: 0;
// }
// ::v-deep .el-tabs__item {
//   color: #ffffff;
// }
// ::v-deep .el-tabs__item.is-active {
//   color: #e99a3c;
// }
// ::v-deep .el-tabs__active-bar {
//   background-color: #e99a3c;
// }
// ::v-deep .el-tabs__nav-wrap::after {
//   background-color: transparent;
// }
</style>
