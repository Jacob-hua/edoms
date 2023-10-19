<template>
  <div class="wrapper">
    <div class="wrapper_left">
      <div class="wrapper_left_last">
        <CalculationSheet :option="lastMouth"></CalculationSheet>
      </div>
      <div style="margin-top: 40px" class="wrapper_left_last">
        <CalculationSheet :option="nextMouth"></CalculationSheet>
      </div>
    </div>
    <div class="wrapper_right">
      <button @click="changeDialog('month')">{{ t('月曲线分析') }}</button>
      <button @click="changeDialog('day')">{{ t('日曲线分析') }}</button>
      <div class="wrapper_right_qu">
        <div class="histogram">
          <EdomsCharts class="charts" :option="monthlyStatistic(monthlyStatisticData)"></EdomsCharts>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      width="1480px"
      top="65px"
      style="height: 723px; background: #000; border: 1px solid #013460"
    >
      <template #header>
        <div class="my-header">
          <img style="margin: 0 20px" src="../../assets/power.png" alt="" />
          <span>{{ title }}</span>
        </div>
      </template>
      <div class="dialog_con">
        <div class="dialog_top">
          <div class="time">
            <span>{{ t('配电室') }}</span>
            <TimeCalendar :option="timeType"></TimeCalendar>
          </div>
          <div v-if="nowDialog" class="boxCheck">
            <el-checkbox-group v-model="activeChart" @change="selectType">
              <el-checkbox v-for="typeItem in chartTypes" :key="typeItem" :label="typeItem">
                {{ typeItem }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="selectShow" class="boxSelect">
            <el-select v-model="dataValue" :teleported="false" popper-class="select" class="m-2" placeholder="Select">
              <el-option v-for="item in dataOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </div>
        <div class="chartMonth">
          <EdomsCharts
            class="chartsCon"
            :option="
              timeType === 'day'
                ? dayPowerFactor(loadData, unbalanceData)
                : monthlyPowerFactor(candlestickData, diffBarData, maxLineData, minLineData, menLineData)
            "
          ></EdomsCharts>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import useI18n from '../../../useI18n';
import { ElectricEnergyQuality } from '../type';

import CalculationSheet from './CalculationSheet.vue';
import TimeCalendar from './TimeCalendar.vue';

const { t } = useI18n();

const props = defineProps<{
  config: ElectricEnergyQuality;
}>();

const lastMouth = {
  title: t('上月结算'),
};
const nextMouth = {
  title: t('本月结算'),
};

const timeType = ref<string>('date');
const dialogVisible = ref<boolean>(false);
const nowDialog = ref<boolean>(false);
const selectShow = ref<boolean>(false);
const chartTypes = [t('箱线图'), t('差值波动'), t('Max曲线'), t('Min曲线'), t('均值曲线')];
const activeChart = ref<any>(chartTypes);
const dataOptions = [
  { value: 'load', label: t('功率因数_负载率') },
  { value: 'hour', label: t('功率因数_小时') },
  { value: 'week', label: t('功率因数_周') },
];
const dataValue = ref<string>(dataOptions[0].value);

// dialog名称
const title = ref<string>('');

const monthlyStatisticData = ref<number[]>([0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1]);

const candlestickData = ref<Array<Array<number>>>([
  [0.85, 0.86, 0.7, 0.86],
  [0.85, 0.86, 0.75, 0.86],
  [0.85, 0.86, 0.6, 0.86],
  [0.85, 0.86, 0.55, 0.86],
  [0.85, 0.86, 0.7, 0.86],
  [0.85, 0.86, 0.75, 0.86],
  [0.85, 0.86, 0.7, 0.86],
  [0.85, 0.86, 0.65, 0.86],
  [0.85, 0.86, 0.7, 0.86],
  [0.85, 0.86, 0.65, 0.86],
  [0.85, 0.86, 0.55, 0.86],
  [0.85, 0.86, 0.6, 0.86],
  [0.85, 0.86, 0.7, 0.86],
  [0.85, 0.86, 0.75, 0.86],
  [0.85, 0.86, 0.6, 0.86],
  [0.85, 0.86, 0.7, 0.86],
  [0.85, 0.86, 0.55, 0.86],
]);

const diffBarData = ref<number[]>([
  0.3, 0.1, 0.15, 0.3, 0.11, 0.16, 0.2, 0.2, 0.17, 0.4, 0.13, 0.18, 0.3, 0.14, 0.19, 0.2, 0.1, 0.15, 0.6, 0.11, 0.16,
  0.7, 0.12, 0.17, 0.8, 0.13, 0.18, 0.9, 0.14, 0.19, 0.23,
]);

const maxLineData = ref<number[]>([
  0.25, 0.28, 0.55, 0.46, 0.33, 0.8, 0.74, 0.52, 0.37, 0.58, 0.63, 0.48, 0.29, 0.54, 0.69, 0.75, 0.56, 0.35, 0.52, 0.73,
  0.69, 0.41, 0.5, 0.61, 0.64, 0.23, 0.22, 0.45, 0.33, 0.71, 0.52,
]);

const minLineData = ref<number[]>([
  0.29, 0.38, 0.25, 0.36, 0.83, 0.7, 0.64, 0.42, 0.34, 0.55, 0.64, 0.28, 0.39, 0.5, 0.65, 0.55, 0.2, 0.35, 0.36, 0.51,
  0.6, 0.47, 0.59, 0.57, 0.6, 0.32, 0.58, 0.44, 0.34, 0.59, 0.43,
]);

const menLineData = ref<number[]>([
  0.36, 0.78, 0.22, 0.56, 0.23, 0.6, 0.54, 0.24, 0.35, 0.55, 0.43, 0.68, 0.79, 0.54, 0.49, 0.65, 0.52, 0.43, 0.54, 0.75,
  0.67, 0.45, 0.51, 0.64, 0.65, 0.43, 0.58, 0.79, 0.34, 0.71, 0.43,
]);

const loadData = ref<number[]>([
  0.55, 0.58, 0.15, 0.36, 0.53, 0.4, 0.64, 0.42, 0.27, 0.55, 0.43, 0.78, 0.39, 0.44, 0.59, 0.65, 0.5, 0.45, 0.56, 0.71,
  0.66, 0.47, 0.52, 0.67, 0.68,
]);

const unbalanceData = ref<number[]>([
  0.25, 0.28, 0.55, 0.46, 0.33, 0.8, 0.74, 0.52, 0.37, 0.58, 0.63, 0.48, 0.29, 0.54, 0.69, 0.75, 0.56, 0.35, 0.52, 0.73,
  0.69, 0.41, 0.5, 0.61, 0.64,
]);

// 月度功率因数统计
const monthlyStatistic = (data: number[]): ECOption => ({
  grid: {
    left: 24,
    bottom: 28,
    right: 20,
  },
  xAxis: {
    type: 'category',
    name: t('月'),
    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  color: 'rgba(40,124,232,0.5)',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11,34,52,0.9)',
    borderColor: '#204C6F',
    borderWidth: 1,
    formatter: (params: any) => {
      let tip: string = '';
      if (params != null && params.length > 0) {
        tip += '<div>';
        for (let index = 0; index < params.length; index++) {
          tip +=
            '<p style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
            params[index].name +
            '</p><p><span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
            params[index].seriesName.split('：')[0] +
            '：</span><span style="color: #287CE7;font-size: 12px;font-weight: 400;">' +
            params[index].seriesName.split('：')[1] +
            '：' +
            params[index].value +
            '</span></p>';
        }
        tip += '</div>';
      }
      return tip;
    },
  },
  legend: {
    top: '5%',
    left: 'center',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
    name: t('月度功率因数统计'),
    nameTextStyle: {
      lineHeight: 28,
      padding: [0, 0, 0, 100],
      fontSize: '14',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 400,
      color: '#EAF5FF',
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1A242B',
        width: 1,
      },
    },
    axisLabel: {
      show: false,
    },
  },
  series: [
    {
      name: `${t('考核基准')}：0.9`,
      data,
      type: 'bar',
      itemStyle: {
        borderWidth: 1,
        borderColor: '#287CE8',
      },
      barWidth: 16,
      barGap: 70,
    },
  ],
});

const monthlyPowerFactor = (
  candlestick: Array<Array<number>>,
  diffBar: number[],
  maxLine: number[],
  minLine: number[],
  menLine: number[]
): ECOption => ({
  xAxis: {
    type: 'category',
    data: Array.from({ length: 31 }, (_, index) => index + 1),
    axisTick: {
      show: false,
    },
  },
  color: 'rgba(40,124,232,0.5)',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11,34,52,0.9)',
    borderColor: '#204C6F',
    borderWidth: 1,
    formatter: (params: any) => {
      let tip: string = '';
      if (params != null && params.length > 0) {
        console.log(params);
        tip += '<div>';
        for (let index = 0; index < params.length; index++) {
          tip +=
            '<p><span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
            params[index].seriesName +
            '：</span><span style="color:' +
            params[index].color +
            ';font-size: 12px;font-weight: 400;">' +
            params[index].value +
            '</span></p>';
        }
        tip += '</div>';
      }
      return tip;
    },
  },
  legend: {
    show: false,
    selected: { 箱线图: true, 差值波动: true, Max曲线: true, Min曲线: true, 均值曲线: true },
  },
  yAxis: {
    type: 'value',
    nameTextStyle: {
      fontSize: '14',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 400,
      color: '#EAF5FF',
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1A242B',
        width: 1,
      },
    },
  },
  grid: { top: '30px', left: '30px', right: '30px', bottom: '30px' },
  series: [
    {
      name: t('箱线图'),
      type: 'candlestick',
      color: 'rgba(40,124,232,0.3)',
      data: candlestick,
      itemStyle: {
        color: 'rgba(40, 124, 232, 0.3)',
        borderWidth: 1,
        borderColor: '#287CE8',
      },
    },
    {
      name: t('差值波动'),
      type: 'bar',
      data: diffBar,
      itemStyle: {
        color: 'rgba(40, 124, 232, 0.3)',
        borderWidth: 1,
        borderColor: '#287CE8',
      },
      barWidth: 16,
      barGap: 35,
    },
    {
      name: t('Max曲线'),
      type: 'line',
      color: '#207C44',
      data: maxLine,
      smooth: true,
      symbolSize: 0,
      markLine: {
        lineStyle: {
          color: '#0E9CFF',
          width: 1,
          type: 'dashed',
        },
        label: {
          show: false,
        },
        data: [
          {
            name: t('考核基准'),
            yAxis: props.config.examine,
          },
        ],
        silent: true,
        symbol: 'none',
      },
    },
    {
      name: t('Min曲线'),
      type: 'line',
      color: '#30A9A5',
      data: minLine,
      smooth: true,
      symbolSize: 0,
    },
    {
      name: t('均值曲线'),
      type: 'line',
      data: menLine,
      smooth: true,
      symbolSize: 0,
    },
  ],
});

const dayPowerFactor = (loadData: number[], unbalanceData: number[]): ECOption => ({
  xAxis: {
    type: 'category',
    data: Array.from({ length: 31 }, (_, index) => index + 1),
    axisTick: {
      show: false,
    },
  },
  color: 'rgba(40,124,232,0.5)',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11,34,52,0.9)',
    borderColor: '#204C6F',
    borderWidth: 1,
    formatter: (params: any) => {
      let tip: string = '';
      if (params != null && params.length > 0) {
        tip += '<div>';
        for (let index = 0; index < params.length; index++) {
          tip +=
            '<p><span style="color: #F5F7FA">' +
            params[index].seriesName +
            '：</span><span style="color:' +
            params[index].color +
            '">' +
            params[index].value +
            '%</span></p>';
        }
        tip += '</div>';
      }
      return tip;
    },
  },
  yAxis: {
    type: 'value',
    nameTextStyle: {
      fontSize: '14',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 400,
      color: '#EAF5FF',
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1A242B',
        width: 1,
      },
    },
  },
  grid: { top: '30px', left: '30px', right: '30px', bottom: '30px' },
  series: [
    {
      name: t('负载率'),
      type: 'line',
      color: '#40E0DA',
      data: loadData,
      smooth: true,
      symbolSize: 0,
      markLine: {
        lineStyle: {
          color: '#0E9CFF',
          width: 1,
          type: 'dashed',
        },
        label: {
          show: false,
        },
        data: [
          {
            name: t('考核基准'),
            yAxis: props.config.examine,
          },
        ],
        silent: true,
        symbol: 'none',
      },
    },
    {
      name: t('三相不平衡率'),
      type: 'line',
      color: '#246ECE',
      data: unbalanceData,
      smooth: true,
      symbolSize: 0,
    },
  ],
});

// dialog弹框
const changeDialog = (val: string) => {
  dialogVisible.value = true;
  if (val === 'month') {
    timeType.value = 'month';
    nowDialog.value = true;
    selectShow.value = false;
    title.value = t('功率因数_月曲线分析');
    activeChart.value = chartTypes;
  } else if (val === 'day') {
    timeType.value = 'date';
    nowDialog.value = false;
    selectShow.value = false;
    title.value = t('功率因数_日曲线分析');
  }
};

// 多选框值改变触发
const selectType = () => {
  const checkObj: any = {};
  let checkObj_item: string = '';
  for (let index = 0; index < activeChart.value.length; index++) {
    checkObj_item = activeChart.value[index];
    checkObj[checkObj_item] = true;
  }
  const selObj: any = {};
  let selObj_item: string = '';
  for (let index = 0; index < chartTypes.length; index++) {
    selObj_item = chartTypes[index];
    selObj[selObj_item] = false;
  }
  // const showObj = Object.assign(selObj, checkObj);
  // optionMonth_chart.value.legend = {
  //   show: false,
  //   selected: showObj,
  // };
};
</script>

<style lang="scss" scoped>
:deep(.el-table tr) {
  height: 46px;
}

:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  border: none;
  text-align: center;
}

:deep(.el-table .el-table__body tr:nth-child(even)) {
  background-color: #0d1218;
  color: #eaf5ff;
}

:deep(.el-table__inner-wrapper::before) {
  content: none;
}

:deep(.el-table .el-table__body tr:nth-child(odd)) {
  background-color: #080b0f;
  color: #eaf5ff;
}

:deep(.alculation_con .el-row .el-col .grid-content) {
  p {
    margin-top: 30px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #eaf5ff;

    span {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #41e4de;
    }
  }
}

:deep(.el-dialog__header) {
  padding: 0;
  width: 1480px;
  height: 52px;
  background-image: url('../../assets/title-bg.png');
  background-size: 100% 100%;
  border-bottom: 1px solid #013460;
}

:deep(.el-input__wrapper) {
  background: #030507;
  box-shadow: none;
  border: 1px solid #454e72;

  .el-input__inner {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }
}

:deep(.el-popper.is-pure) {
  inset: auto !important;
}

:deep(.el-select-dropdown__list) {
  margin: auto !important;
}

:deep(.el-popper__arrow::before) {
  content: none;
}

.wrapper {
  height: 660px;
  margin: 30px 30px;
  display: flex;

  .wrapper_left {
    width: 782px;
    margin-right: 20px;

    .wrapper_left_last {
      height: 310px;
    }

    .wrapper_left_now {
      height: 310px;
      background: rgba(9, 15, 23, 0.3);
      border: 1px solid #212c3c;
    }
  }

  .wrapper_right {
    width: 938px;

    button {
      min-width: 130px;
      height: 36px;
      background: rgba(0, 163, 255, 0.16);
      border: 1px solid #007bc0;
      border-radius: 2px;
      margin-right: 40px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
    }

    .wrapper_right_qu {
      height: 604px;
      margin-top: 20px;
      background: rgba(9, 15, 23, 0.3);
      border: 1px solid #212c3c;

      .histogram {
        width: 938px;
        height: 100%;

        .charts {
          width: 100%;
          height: 100%;
        }
      }

      .table {
        height: 270px;
        padding: 20px;

        .table_tie {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #eaf5ff;
          margin-bottom: 18px;
        }
      }
    }
  }

  .my-header {
    height: 52px;
    line-height: 52px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #eaf5ff;
  }

  .dialog_top {
    height: 60px;
    display: flex;
    justify-content: space-between;

    span {
      margin: 0px 27px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      line-height: 80px;
    }

    .time {
      height: 60px;
      display: flex;
    }

    .boxCheck {
      height: 60px;
      width: 530px;
      padding-top: 30px;
    }

    .boxSelect {
      margin-top: 30px;
      width: 200px;
      height: 32px;
      margin-right: 30px;
      background: #030507;
      box-sizing: border-box;

      .select {
        inset: auto !important;
        background-color: #030507;

        .el-select-dropdown__item {
          border-bottom: 1px solid #454e72;
          background-color: #030507;
          padding: 0 !important;
          text-align: center;
        }
      }
    }
  }

  .dialog_con .chartMonth {
    width: 1420px;
    height: 550px;

    .chartsCon {
      width: 1420px;
      height: 550px;
    }
  }
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: rgba(40, 124, 232);
  border: 1px solid #287ce8;
  border-radius: 4px;
}

:deep(.el-dialog__body) {
  width: 1424px;
  height: 610px;
  border: 1px solid #212c3c;
  background: rgba(9, 15, 23, 0.3);
  padding: 0px;
  margin: 30px;
}
</style>
