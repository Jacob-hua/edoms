<template>
  <div class="wrapper">
    <div class="echart">
      <span>{{ props.option.tit }}</span>
    </div>

    <EdomsCharts class="charts" :option="option"></EdomsCharts>
  </div>
</template>

<script lang="ts" setup>
import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
const props = defineProps<{
  option: ECOption;
}>();
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
  width: 100%;
  height: 100%;

  .echart {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #eaf5ff;

    span {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #eaf5ff;
    }
  }

  .charts {
    margin-top: 30px;
    height: 90%;
    background: rgba(9, 15, 23, 0.3);
    border: 1px solid #212c3c;
    box-sizing: border-box;
  }
}
</style>
