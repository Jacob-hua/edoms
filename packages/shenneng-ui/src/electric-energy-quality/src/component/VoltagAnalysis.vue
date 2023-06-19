<template>
  <div class="wrapper">
    <div class="wrapper-tab">
      <!-- <div class="calendar">日历插件</div> -->
      <TimeCalendar :option="timeType" class="calendar"></TimeCalendar>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane :label="t('今日统计')" name="day">
          <Statistics></Statistics>
        </el-tab-pane>
        <el-tab-pane :label="t('月度统计')" name="month">
          <Statistics></Statistics>
        </el-tab-pane>
        <el-tab-pane :label="t('年度统计')" name="year">
          <Statistics></Statistics>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="wrapper-con">
      <div class="wrapper-con-right">
        <div class="wrapper-tie">
          <span>{{ t('描述') }}</span>
        </div>
        <div class="wrapper-icon">
          <img class="icon" src="../../assets/dian.png" alt="" />
          <span class="elefont">{{ t('电压波动分析') }}</span>
        </div>
        <EdomsCharts class="charts" :option="option_chart"></EdomsCharts>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import useI18n from '../../../useI18n';

import Statistics from './Statistics.vue';
import TimeCalendar from './TimeCalendar.vue';
const { t } = useI18n();
// defineProps<{
//   option: ECOption;
// }>();
const timeType = ref<string>('date');
const option_chart = ref<ECOption>({});
option_chart.value = {
  grid: {
    left: 24,
    bottom: 42,
    right: 20,
  },
  xAxis: {
    type: 'category',
    data: ['-10.0%', '-5.0%', '-3.0%', '-2.0%', '0.0%', '+2.0%', '+3.0%', '+5.0%', '+10.0%'],
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1A242B',
        width: 1,
      },
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
  },
  series: [
    {
      data: [
        { value: 50, itemStyle: { color: 'rgba(194, 3, 3, 0.5)', borderWidth: 1, borderColor: 'rgba(194, 3, 3, 1)' } },
        {
          value: 100,
          itemStyle: { color: 'rgba(255, 102, 0, 0.5)', borderWidth: 1, borderColor: 'rgba(255, 102, 0, 1)' },
        },
        {
          value: 150,
          itemStyle: { color: 'rgba(230, 138, 1, 0.5)', borderWidth: 1, borderColor: 'rgba(230, 138, 1, 1)' },
        },
        {
          value: 200,
          itemStyle: { color: 'rgba(255, 255, 0, 0.5)', borderWidth: 1, borderColor: 'rgba(255, 255, 0, 1)' },
        },
        { value: 250, itemStyle: { color: 'rgba(0, 255, 0, 0.5)', borderWidth: 1, borderColor: 'rgba(0, 255, 0, 1)' } },
        {
          value: 200,
          itemStyle: { color: 'rgba(255, 255, 0, 0.5)', borderWidth: 1, borderColor: 'rgba(255, 255, 0, 1)' },
        },
        {
          value: 150,
          itemStyle: { color: 'rgba(230, 138, 1, 0.5)', borderWidth: 1, borderColor: 'rgba(230, 138, 1, 1)' },
        },
        {
          value: 100,
          itemStyle: { color: 'rgba(255, 102, 0, 0.5)', borderWidth: 1, borderColor: 'rgba(255, 102, 0, 1)' },
        },
        { value: 50, itemStyle: { color: 'rgba(194, 3, 3, 0.5)', borderWidth: 1, borderColor: 'rgba(194, 3, 3, 1)' } },
      ],
      label: {
        color: '#EAF5FF',
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

:deep(.el-tabs__active-bar) {
  background: #00a3ff;
}

:deep(.el-tabs__item) {
  color: #eaf5ff;
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

      .wrapper-tie {
        width: 399px;
        height: 36px;
        box-sizing: border-box;
        border-radius: 2px;
        margin: 20px auto;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #c4e5f8;
        line-height: 36px;
        background: #030e16;
        text-align: center;
      }

      .wrapper-icon {
        height: 20px;
        line-height: 20px;
        color: #eaf5ff;
        font-size: 16px;
        margin-left: 24px;
        .icon {
          width: 18px;
          height: 18px;
        }
        .elefont {
          margin-left: 10px;
        }
      }
      .charts {
        width: 958px;
        height: 500px;
      }
    }
  }
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
}
</style>
