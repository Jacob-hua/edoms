<template>
  <div class="wrapper">
    <div class="wrapper_left">
      <div class="wrapper_left_last">
        <CalculationSheet></CalculationSheet>
      </div>
      <div style="margin-top: 40px" class="wrapper_left_last">
        <CalculationSheet></CalculationSheet>
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
            <TimeCalendar></TimeCalendar>
          </div>
          <div v-if="nowDialog" class="boxCheck">
            <el-checkbox-group v-model="checkList" @change="selectType">
              <el-checkbox v-for="typeItem in checkTypeList" :key="typeItem" :label="typeItem">{{
                typeItem
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="selectShow" class="boxSelect">
            <el-select v-model="dataValue" class="m-2" placeholder="Select">
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

import CalculationSheet from './CalculationSheet.vue';
import TimeCalendar from './TimeCalendar.vue';
// defineProps<{
//   option: ECOption;
// }>();
const dialogVisible = ref<boolean>(false);
const nowDialog = ref<boolean>(false);
const selectShow = ref<boolean>(false);
const checkTypeList = ['箱线图', '插值波动', 'Max曲线', 'Min曲线', '均值曲线'];
const checkList = ref<any>(['箱线图', '插值波动', 'Max曲线', 'Min曲线', '均值曲线']);
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
  [
    [10.0, 8.04],
    [8.0, 6.95],
    [13.0, 7.58],
    [9.0, 8.81],
    [11.0, 8.33],
    [14.0, 9.96],
    [6.0, 7.24],
    [4.0, 4.26],
    [12.0, 10.84],
    [7.0, 4.82],
    [5.0, 5.68],
  ],
  [
    [10.0, 9.14],
    [8.0, 8.14],
    [13.0, 8.74],
    [9.0, 8.77],
    [11.0, 9.26],
    [14.0, 8.1],
    [6.0, 6.13],
    [4.0, 3.1],
    [12.0, 9.13],
    [7.0, 7.26],
    [5.0, 4.74],
  ],
];
// 月度功率因素统计
const option_chart = ref<ECOption>({});
option_chart.value = {
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  },
  color: 'rgba(40,124,232,0.5)',
  tooltip: {
    trigger: 'axis',
  },
  yAxis: {
    type: 'value',
    name: '月度功率因素统计',
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
  series: [
    {
      name: '考核基准：0.9',
      data: [50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100],
      type: 'bar',
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
    nowDialog.value = true;
    selectShow.value = false;
    title.value = '功率因数-月曲线分析';
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
        selected: { 箱线图: true, 插值波动: true, Max曲线: true, Min曲线: true, 均值曲线: true },
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
          type: 'bar',
          data: [
            5, 10, 15, 6, 11, 16, 7, 12, 17, 8, 13, 18, 9, 14, 19, 5, 10, 15, 6, 11, 16, 7, 12, 17, 8, 13, 18, 9, 14,
            19, 23,
          ],
          barWidth: 16,
          barGap: 35,
        },
        {
          name: '插值波动',
          type: 'line',
          color: '#0C7AC8',
          data: [
            55, 58, 15, 36, 53, 40, 64, 42, 27, 55, 43, 78, 39, 44, 59, 65, 50, 45, 56, 71, 66, 47, 52, 67, 68, 33, 28,
            49, 34, 79, 53,
          ],
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'Max曲线',
          type: 'line',
          color: '#207C44',
          data: [
            25, 28, 55, 46, 33, 80, 74, 52, 37, 58, 63, 48, 29, 54, 69, 75, 56, 35, 52, 73, 69, 41, 50, 61, 64, 23, 22,
            45, 33, 71, 52,
          ],
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'Min曲线',
          type: 'line',
          color: '#30A9A5',
          data: [
            29, 38, 25, 36, 83, 70, 64, 42, 34, 55, 64, 28, 39, 50, 65, 55, 20, 35, 36, 51, 60, 47, 59, 57, 60, 32, 58,
            44, 34, 59, 43,
          ],
          smooth: true,
          symbolSize: 0,
        },
        {
          name: '均值曲线',
          type: 'line',
          data: [
            36, 78, 22, 56, 23, 60, 54, 24, 35, 55, 43, 68, 79, 54, 49, 65, 52, 43, 54, 75, 67, 45, 51, 64, 65, 43, 58,
            79, 34, 71, 43,
          ],
          smooth: true,
          symbolSize: 0,
        },
      ],
    };
  } else if (val === 'day') {
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
            data: [
              {
                name: '考核基准',
                yAxis: 50,
              },
            ],
            silent: true,
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
    nowDialog.value = false;
    selectShow.value = true;
    title.value = '功率因数-数据分析';
    // 数据分析
    optionMonth_chart.value = {
      xAxis: {
        type: 'category',
        data: ['0~10%', '10~20%', '20~30%', '30~40%', '40~50%', '50~60%', '60~70%', '70~80%', '80~90%', '90~10%0'],
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
      },
      grid: { top: '30px', left: '30px', right: '30px', bottom: '30px' },
      color: ['rgba(65,228,222,0.5)', 'rgba(215,40,36,0.5)'],
      series: [
        {
          symbolSize: 20,
          data: dataAll[0],
          type: 'scatter',
          markLine: {
            data: [
              {
                name: '考核基准',
                yAxis: 6,
              },
            ],
            silent: true,
          },
        },
        {
          symbolSize: 20,
          data: dataAll[1],
          type: 'scatter',
          markLine: {
            data: [
              {
                name: '考核基准',
                yAxis: 6,
              },
            ],
            silent: true,
          },
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
  background: #06172d;
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
          margin-left: 30px;
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
    }
  }

  .dialog_con .chartMonth {
    width: 1420px;
    height: 500px;

    .chartsCon {
      width: 1420px;
      height: 500px;
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
