<template>
  <div class="wrapper">
    <div class="wrapper-tab">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="今日统计" name="day">
          <Statistics></Statistics>
        </el-tab-pane>
        <el-tab-pane label="月度统计" name="month">
          <Statistics></Statistics>
        </el-tab-pane>
        <el-tab-pane label="年度统计" name="year">
          <Statistics></Statistics>
        </el-tab-pane>
      </el-tabs>
      <div class="calendar">日历插件</div>
    </div>

    <div class="wrapper-con">
      <div class="wrapper-con-right"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import Statistics from './Statistics.vue';

const activeName = ref('day');
</script>

<style lang="scss" scoped>
:deep(.el-tabs__nav) {
  line-height: 80px;
}

:deep(.el-tabs__header) {
  margin: 0px;
}
:deep(.el-tabs__nav-wrap::after) {
  content: none;
}
.wrapper {
  height: 688px;
  margin: 0px 30px 0px 30px;
  display: flex;

  .wrapper-tab {
    width: 782px;
    // height: 65px;
    .calendar {
      float: left;
    }
  }

  .wrapper-con {
    height: 610px;
    margin-top: 65px;
    .wrapper-con-right {
      width: 958px;
      height: 610px;
      background: rgba(9, 15, 23, 0.3);
      border: 1px solid #212c3c;
    }
  }
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
