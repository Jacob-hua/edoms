<template>
  <div class="wrapper">
    <div class="wrapper-tab">
      <!-- <div class="calendar">日历插件</div> -->
      <TimeCalendar class="calendar"></TimeCalendar>
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
    </div>

    <div class="wrapper-con">
      <div class="wrapper-con-right">
        <EdomsCharts class="charts" :option="option_chart"></EdomsCharts>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';

import Statistics from './Statistics.vue';
import TimeCalendar from './TimeCalendar.vue';
// defineProps<{
//   option: ECOption;
// }>();
const option_chart = ref<ECOption>({});
option_chart.value = {
  title: {
    text: 'vGB/T12326-2008《电能质量：电压波动和闪变》',
    left: 'center',
    textStyle: {
      color: '#C4E5F8',
      fontWeight: '600',
      fontSize: '16',
    },
  },
  xAxis: {
    type: 'category',
    data: ['-10.0%', '-5.0%', '-3.0%', '-2.0%', '-1.0%', '-2.0%', '-3.0%', '-5.0%', '-10.0%'],
  },
  yAxis: {
    type: 'value',
    name: '电压波动分析',
    nameTextStyle: {
      fontSize: '16',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 400,
      color: '#EAF5FF',
    },
  },
  series: [
    {
      data: [
        { value: 50, itemStyle: { color: 'rgba(194, 3, 3, 0.5)' } },
        { value: 100, itemStyle: { color: 'rgba(255, 102, 0, 0.5)' } },
        { value: 150, itemStyle: { color: 'rgba(230, 138, 1, 0.5)' } },
        { value: 200, itemStyle: { color: 'rgba(255, 255, 0, 0.5)' } },
        { value: 250, itemStyle: { color: 'rgba(0, 255, 0, 0.5)' } },
        { value: 200, itemStyle: { color: 'rgba(255, 255, 0, 0.5)' } },
        { value: 150, itemStyle: { color: 'rgba(230, 138, 1, 0.5)' } },
        { value: 100, itemStyle: { color: 'rgba(255, 102, 0, 0.5)' } },
        { value: 50, itemStyle: { color: 'rgba(194, 3, 3, 0.5)' } },
      ],
      label: {
        show: true,
        position: 'top',
      },
      type: 'bar',
      barWidth: 30,
      barGap: 70,
    },
  ],
};

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
      float: right;
      margin-right: 30px;
    }
  }

  .wrapper-con {
    height: 610px;
    margin-top: 75px;

    .wrapper-con-right {
      width: 958px;
      height: 610px;
      background: rgba(9, 15, 23, 0.3);
      border: 1px solid #212c3c;

      .charts {
        width: 958px;
        height: 610px;
      }
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
