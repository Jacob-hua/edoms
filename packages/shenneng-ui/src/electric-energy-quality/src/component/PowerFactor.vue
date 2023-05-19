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
      <button @click="changeDilog('month')">月曲线分析</button>
      <button @click="changeDilog('day')">日曲线分析</button>
      <button @click="changeDilog('data')">数据分析</button>
      <div class="wrapper_right_qu">
        <div class="histogram">
          <EdomsCharts class="charts" :option="option_chart"></EdomsCharts>
        </div>
        <div class="table">
          <p class="table_tie">无功优化补偿装置</p>
          <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="{ background: '#0D1218', color: '#EAF5FF', textAlign: 'center', border: 'none' }"
          >
            <el-table-column prop="typesOf" label="类型" width="180" />
            <el-table-column prop="position" label="接入位置" width="180" />
            <el-table-column prop="state" label="状态" />
            <el-table-column prop="adjustment" label="调节量" />
            <el-table-column prop="range" label="调节范围" />
          </el-table>
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
            <span>配电室</span>
            <TimeCalendar :option="timeType"></TimeCalendar>
          </div>
          <div v-if="nowDialog" class="boxCheck">
            <el-checkbox-group v-model="checkList" @change="selectType">
              <el-checkbox v-for="typeItem in checkTypeList" :key="typeItem" :label="typeItem">{{
                typeItem
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="selectShow" class="boxSelect">
            <el-select v-model="dataValue" popper-class="select" class="m-2" placeholder="Select">
              <el-option v-for="item in dataOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </div>
        <div class="chartMonth">
          <EdomsCharts class="chartsCon" :option="optionMonth_chart"></EdomsCharts>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import { ElectricEnergyQuality } from '../type';

import CalculationSheet from './CalculationSheet.vue';
import TimeCalendar from './TimeCalendar.vue';
const props = defineProps<{
  config: ElectricEnergyQuality;
}>();
const lastMouth = {
  title: '上月结算',
};
const nextMouth = {
  title: '本月结算',
};
const timeType = ref<string>('date');
const dialogVisible = ref<boolean>(false);
const nowDialog = ref<boolean>(false);
const selectShow = ref<boolean>(false);
const checkTypeList = ['箱线图', '差值波动', 'Max曲线', 'Min曲线', '均值曲线'];
const checkList = ref<any>(['箱线图', '差值波动', 'Max曲线', 'Min曲线', '均值曲线']);
const dataOptions = [
  { value: 'load', label: '功率因数-负载率' },
  { value: 'hour', label: '功率因数-时间（小时）' },
  { value: 'week', label: '功率因数-时间（周）' },
];
const dataValue = ref<string>(dataOptions[0].value);
// dialog名称
const title = ref<string>('');
// 散点图数据
const dataAll = [
  [20, 0.69],
  [32, 0.18],
  [65, 0.54],
  [44, 0.65],
  [35, 0.47],
  [78, 0.35],
  [12, 0.65],
  [55, 0.77],
  [60, 0.33],
  [44, 0.55],
  [25, 0.2],
  [69, 0.2],
  [18, 0.32],
  [54, 0.65],
  [65, 0.44],
  [47, 0.35],
  [35, 0.78],
  [65, 0.12],
  [77, 0.55],
  [33, 0.6],
  [55, 0.44],
  [20, 0.25],
];
const maxArr = ref<any>([]);
const minArr = ref<any>([]);
dataAll.forEach((item) => {
  if (item[1] > props.config.examine) {
    maxArr.value.push(item);
  } else {
    minArr.value.push(item);
  }
});
// 月度功率因数统计
const option_chart = ref<ECOption>({});
option_chart.value = {
  grid: {
    left: 24,
    bottom: 28,
    right: 20,
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
    name: '月度功率因数统计',
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
      name: '考核基准：0.9',
      data: [0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1],
      type: 'bar',
      itemStyle: {
        borderWidth: 1,
        borderColor: '#287CE8',
      },
      barWidth: 16,
      barGap: 70,
    },
  ],
};
const optionMonth_chart = ref<ECOption>({});
// dialog弹框
const changeDilog = (val: string) => {
  dialogVisible.value = true;
  if (val === 'month') {
    timeType.value = 'month';
    nowDialog.value = true;
    selectShow.value = false;
    title.value = '功率因数-月曲线分析';
    checkList.value = ['箱线图', '差值波动', 'Max曲线', 'Min曲线', '均值曲线'];
    // 月曲线分析图表
    optionMonth_chart.value = {
      xAxis: {
        type: 'category',
        data: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
          '25',
          '26',
          '27',
          '28',
          '29',
          '30',
          '31',
        ],
      },
      color: 'rgba(40,124,232,0.5)',
      tooltip: {
        trigger: 'axis',
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
          name: '箱线图',
          type: 'candlestick',
          color: 'rgba(40,124,232,0.3)',
          data: [
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
          ],
          itemStyle: {
            color: 'rgba(40, 124, 232, 0.3)',
            borderWidth: 1,
            borderColor: '#287CE8',
          },
        },
        {
          name: '差值波动',
          type: 'bar',
          data: [
            0.3, 0.1, 0.15, 0.3, 0.11, 0.16, 0.2, 0.2, 0.17, 0.4, 0.13, 0.18, 0.3, 0.14, 0.19, 0.2, 0.1, 0.15, 0.6,
            0.11, 0.16, 0.7, 0.12, 0.17, 0.8, 0.13, 0.18, 0.9, 0.14, 0.19, 0.23,
          ],
          itemStyle: {
            color: 'rgba(40, 124, 232, 0.3)',
            borderWidth: 1,
            borderColor: '#287CE8',
          },
          barWidth: 16,
          barGap: 35,
        },
        {
          name: 'Max曲线',
          type: 'line',
          color: '#207C44',
          data: [
            0.25, 0.28, 0.55, 0.46, 0.33, 0.8, 0.74, 0.52, 0.37, 0.58, 0.63, 0.48, 0.29, 0.54, 0.69, 0.75, 0.56, 0.35,
            0.52, 0.73, 0.69, 0.41, 0.5, 0.61, 0.64, 0.23, 0.22, 0.45, 0.33, 0.71, 0.52,
          ],
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
                name: '考核基准',
                yAxis: props.config.examine,
              },
            ],
            silent: true,
            symbol: 'none',
          },
        },
        {
          name: 'Min曲线',
          type: 'line',
          color: '#30A9A5',
          data: [
            0.29, 0.38, 0.25, 0.36, 0.83, 0.7, 0.64, 0.42, 0.34, 0.55, 0.64, 0.28, 0.39, 0.5, 0.65, 0.55, 0.2, 0.35,
            0.36, 0.51, 0.6, 0.47, 0.59, 0.57, 0.6, 0.32, 0.58, 0.44, 0.34, 0.59, 0.43,
          ],
          smooth: true,
          symbolSize: 0,
        },
        {
          name: '均值曲线',
          type: 'line',
          data: [
            0.36, 0.78, 0.22, 0.56, 0.23, 0.6, 0.54, 0.24, 0.35, 0.55, 0.43, 0.68, 0.79, 0.54, 0.49, 0.65, 0.52, 0.43,
            0.54, 0.75, 0.67, 0.45, 0.51, 0.64, 0.65, 0.43, 0.58, 0.79, 0.34, 0.71, 0.43,
          ],
          smooth: true,
          symbolSize: 0,
        },
      ],
    };
  } else if (val === 'day') {
    timeType.value = 'date';
    nowDialog.value = false;
    selectShow.value = false;
    title.value = '功率因数-日曲线分析';
    // 日曲线分析
    optionMonth_chart.value = {
      xAxis: {
        type: 'category',
        data: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
        ],
      },
      color: 'rgba(40,124,232,0.5)',
      tooltip: {
        trigger: 'axis',
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
          name: '负载率',
          type: 'line',
          color: '#40E0DA',
          data: [55, 58, 15, 36, 53, 40, 64, 42, 27, 55, 43, 78, 39, 44, 59, 65, 50, 45, 56, 71, 66, 47, 52, 67, 68],
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
                name: '考核基准',
                yAxis: props.config.examine,
              },
            ],
            silent: true,
            symbol: 'none',
          },
        },
        {
          name: '三相不平衡率',
          type: 'line',
          color: '#246ECE',
          data: [25, 28, 55, 46, 33, 80, 74, 52, 37, 58, 63, 48, 29, 54, 69, 75, 56, 35, 52, 73, 69, 41, 50, 61, 64],
          smooth: true,
          symbolSize: 0,
        },
      ],
    };
  } else {
    timeType.value = 'date';
    nowDialog.value = false;
    selectShow.value = true;
    title.value = '功率因数-数据分析';
    // 数据分析
    optionMonth_chart.value = {
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%',
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      tooltip: {
        trigger: 'axis',
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
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      grid: { top: '30px', left: '55px', right: '30px', bottom: '51px' },
      color: ['rgba(65,228,222,0.7)', 'rgba(215,40,36,0.7)'],
      series: [
        {
          symbolSize: 20,
          data: maxArr.value,
          type: 'scatter',
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
                name: '考核基准',
                yAxis: props.config.examine,
              },
            ],
            silent: true,
            symbol: 'none',
          },
        },
        {
          symbolSize: 20,
          data: minArr.value,
          type: 'scatter',
        },
      ],
    };
  }
};

// 多选框值改变触发
const selectType = () => {
  const checkObj: any = {};
  let checkObj_item: string = '';
  for (let index = 0; index < checkList.value.length; index++) {
    checkObj_item = checkList.value[index];
    checkObj[checkObj_item] = true;
  }
  const selObj: any = {};
  let selObj_item: string = '';
  for (let index = 0; index < checkTypeList.length; index++) {
    selObj_item = checkTypeList[index];
    selObj[selObj_item] = false;
  }
  const showObj = Object.assign(selObj, checkObj);
  optionMonth_chart.value.legend.selected = showObj;
};
// 无功优化补偿
const tableData = [
  {
    typesOf: '类型一',
    position: '位置一',
    state: '44.20',
    adjustment: '44.20',
    range: '44.20',
  },
  {
    typesOf: '类型一',
    position: '位置一',
    state: '44.20',
    adjustment: '44.20',
    range: '44.20',
  },
  {
    typesOf: '类型一',
    position: '位置一',
    state: '44.20',
    adjustment: '44.20',
    range: '44.20',
  },
  {
    typesOf: '类型一',
    position: '位置一',
    state: '44.20',
    adjustment: '44.20',
    range: '44.20',
  },
];
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

  .el-input__inner {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }
}

:deep(.el-popper.is-pure) {
  inset: 330px 265px auto auto !important;
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
      width: 130px;
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
        height: 302px;
        width: 938px;

        .charts {
          height: 302px;
          width: 938px;
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
      line-height: 100px;
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

<style lang="scss">
.select {
  inset: 330px auto auto 1438px !important;
  // margin-top: 0px !important;
  background-color: #030507;
  .el-popper__arrow::before {
    content: none;
  }
  .el-select-dropdown__list {
    margin: 0 !important;
    .el-select-dropdown__item {
      border-bottom: 1px solid #454e72;
      background-color: #030507;
      padding: 0 !important;
      text-align: center;
    }
  }
}
</style>
