<template>
  <div class="wrapper">
    <div class="echart">
      <span>{{ props.option.tit }}</span>
      <el-tabs
        v-show="props.option.type === 'current' ? true : false"
        v-model="activeName"
        class="tab demo-tabs"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane :label="t('电流')" name="current"></el-tab-pane>
        <el-tab-pane :label="t('电压')" name="voltage"></el-tab-pane>
      </el-tabs>
    </div>
    <EdomsCharts class="charts" :option="option"></EdomsCharts>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import useI18n from '../../../useI18n';
const { t } = useI18n();
const props = defineProps<{
  option: ECOption;
}>();
const emit = defineEmits<{
  (event: 'ctIndex', val: string): void;
}>();
const activeName = ref('current');
const handleClick = (event: any) => {
  console.log(event.paneName);
  if (event.paneName === activeName.value) return;
  activeName.value = event.paneName;
  emit('ctIndex', activeName.value);
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs__item) {
  padding: 0 !important;
  width: 80px;
  height: 34px;
  color: #eaf5ff;
  text-align: center;
  line-height: 34px;
  background: #031825;
  border: none;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-bottom: none;
  border-left: none;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  background: rgba(0, 163, 255, 0.26);
  border: 1px solid #007bc0;
  color: #ffffff;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border: none;
}

:deep(.el-tabs--card > .el-tabs__header) {
  margin: 0;
  border: none;
}

.wrapper {
  width: 855px;
  height: 100%;
  background: rgba(9, 15, 23, 0.3);
  border: 1px solid #212c3c;
  box-sizing: border-box;

  .echart {
    height: 18%;
    line-height: 62px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #eaf5ff;
    border-bottom: 1px solid #1d2634;
    position: relative;

    span {
      margin-left: 20px;
    }

    .tab {
      position: absolute;
      top: 0px;
      right: 20px;
    }
  }

  .charts {
    height: 82%;
  }
}
</style>
