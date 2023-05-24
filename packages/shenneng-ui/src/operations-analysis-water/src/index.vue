<template>
  <div class="operations-analysis-water" @click="handlerToShow($event, true)">
    <div class="top-bg"></div>
    <div class="bottom-font">{{ config.title }}</div>
    <div v-show="isShowModel" class="model-wrapper-ftst">
      <div class="model-content">
        <div class="content-title">
          <div class="left-title-font">
            <span class="font-icon"></span>
            <span class="font-value">运行分析</span>
          </div>
          <div class="right-close" @click="handlerToShow($event, false)"></div>
        </div>
        <div class="content-data">
          <div class="content-tab">
            <p class="tab-con">最新运行工况数据</p>
            <div class="tab">
              <el-table
                :header-cell-style="{
                  background: '#11161E',
                  color: '#EAF5FF',
                  textAlign: 'center',
                  height: '54px',
                }"
                :cell-style="{ height: '54px', textAlign: 'center', color: '#EAF5FF', background: '#080B0F' }"
                :row-style="{ height: '50px' }"
                :data="tableData"
                style="width: 100%"
              >
                <el-table-column v-for="item in tableDataTitle" :key="item.date" :prop="item.date" :label="item.label">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="content-chart">
            <p class="tab-con">最新运行工况数据</p>
            <div class="tab-chart">
              <div style="margin-right: 15px; margin-bottom: 10px">
                <Charts :option="chart_frequency"></Charts>
              </div>
              <div style="margin-left: 15px; margin-bottom: 10px">
                <Charts :option="chart_power"></Charts>
              </div>
              <div style="margin-right: 15px; margin-top: 10px">
                <Charts :option="chart_current" @ct-index="getThreeData"></Charts>
              </div>
              <div style="margin-left: 15px; margin-top: 10px">
                <Charts :option="chart_quantity"></Charts>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { ECOption } from '../../types';

import Charts from './components/Chartcom.vue';
import { MIntelligenceReport } from './type';

defineProps<{
  config: MIntelligenceReport;
}>();
const isShowModel = ref<boolean>(false);
const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};
const tableData = [
  {
    time: '2023-03-23 17:10:10',
    frequency: '40.5',
    power: '1034',
    quantity: '20',
    currentA: '0',
    currentB: '5.51',
    currentC: '5.08',
    voltageA: '228.2',
    voltageB: '228.2',
    voltageC: '228.2',
  },
];
// 变频器频率
const chart_frequency = ref<ECOption>({});
// 有功功率
const chart_power = ref<ECOption>({});
// 三相电流
const chart_current = ref<ECOption>({});
// 用电量
const chart_quantity = ref<ECOption>({});

const tableDataTitle = [
  {
    date: 'time',
    label: '采集时间',
  },
  {
    date: 'frequency',
    label: '变频器频率（Hz）',
  },
  {
    date: 'power',
    label: '有功功率（W）',
  },
  {
    date: 'quantity',
    label: '日用电量（kWh）',
  },
  {
    date: 'currentA',
    label: 'A相电流（A）',
  },
  {
    date: 'currentB',
    label: 'B相电流（A）',
  },
  {
    date: 'currentC',
    label: 'C相电流（A）',
  },
  {
    date: 'voltageA',
    label: 'A相电压（V）',
  },
  {
    date: 'voltageB',
    label: 'B相电压（V）',
  },
  {
    date: 'voltageC',
    label: 'C相电压（V）',
  },
];

chart_frequency.value = {
  type: 'frequency',
  tit: '变频器频率曲线',
  tooltip: {
    position: 'top',
    trigger: 'axis',
    backgroundColor: 'rgba(11,34,52,0.9)',
    borderColor: '#204C6F',
    borderWidth: 1,
    padding: 15,
    formatter: (params: any) => {
      let tip: string = '';
      if (params != null && params.length > 0) {
        tip += '<div style="width: 130px;height: 45px">';
        for (let index = 0; index < params.length; index++) {
          tip +=
            '<p style="color:#41E4DE">' +
            params[index].name +
            '</p>' +
            '<p><span style="color:#F5F7FA;font-size:12px;font-weight:400">' +
            params[index].seriesName +
            ':</span><span style="margin-left:8px;color:' +
            params[index].color +
            ';font-size:12px;font-weight:400">' +
            params[index].value +
            '</span></p>';
        }
        tip += '</div>';
      }
      return tip;
    },
  },
  legend: {
    textStyle: {
      color: '#EFF7FF',
    },
  },
  xAxis: {
    type: 'category',
    data: [
      '00：00',
      '02：00',
      '04：00',
      '06：00',
      '08：00',
      '10：00',
      '12：00',
      '14：00',
      '16：00',
      '18：00',
      '20：00',
      '22：00',
    ],
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    name: '单位/Hz',
    data: ['0', '20', '40', '60', '80'],
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1A242B',
        width: 1,
      },
    },
  },
  grid: { top: '50px', left: '40px', right: '20px', bottom: '44px' },
  color: '#287CE8',
  series: {
    name: '频率（Hz）',
    data: [0, 20, 15, 10, 40, 20, 66, 24, 33, 54, 66, 21],
    type: 'line',
    smooth: true,
    symbolSize: 0,
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(40, 124, 232, 0.16)', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(40, 124, 232, 0)', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
  },
};

chart_power.value = {
  type: 'power',
  tit: '有功功率曲线',
  tooltip: {
    position: 'top',
    trigger: 'axis',
    backgroundColor: 'rgba(11,34,52,0.9)',
    borderColor: '#204C6F',
    borderWidth: 1,
    padding: 15,
    formatter: (params: any) => {
      let tip: string = '';
      if (params != null && params.length > 0) {
        tip += '<div style="width: 130px;height: 45px">';
        for (let index = 0; index < params.length; index++) {
          tip +=
            '<p style="color:#41E4DE">' +
            params[index].name +
            '</p>' +
            '<p><span style="color:#F5F7FA;font-size:12px;font-weight:400">' +
            params[index].seriesName +
            ':</span><span style="margin-left:8px;color:' +
            params[index].color +
            ';font-size:12px;font-weight:400">' +
            params[index].value +
            '</span></p>';
        }
        tip += '</div>';
      }
      return tip;
    },
  },
  legend: {
    textStyle: {
      color: '#EFF7FF',
    },
  },
  xAxis: {
    type: 'category',
    data: [
      '00：00',
      '02：00',
      '04：00',
      '06：00',
      '08：00',
      '10：00',
      '12：00',
      '14：00',
      '16：00',
      '18：00',
      '20：00',
      '22：00',
    ],
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    name: '单位/W',
    data: ['0', '20', '40', '60', '80'],
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1A242B',
        width: 1,
      },
    },
  },

  grid: { top: '50px', left: '40px', right: '20px', bottom: '44px' },
  color: '#287CE8',
  series: {
    name: '有功功率（W）',
    data: [14, 5, 17, 60, 25, 32, 47, 41, 30, 15, 58, 34],
    type: 'line',
    smooth: true,
    symbolSize: 0,
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(40, 124, 232, 0.16)', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(40, 124, 232, 0)', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
  },
};

chart_current.value = {
  type: 'current',
  tit: '三相电流/电压曲线',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11,34,52,0.9)',
    borderColor: '#204C6F',
    borderWidth: 1,
    formatter: (params: any) => {
      let tip: string = '';
      if (params != null && params.length > 0) {
        tip +=
          '<div style="width:125px;height:90px"><span style="margin-left:8px;color:#41E4DE;font-size:12px;font-weight: 400;line-height:18px">' +
          params[0].name +
          '</span><br />';
        for (let index = 0; index < params.length; index++) {
          tip +=
            '<span style="margin-left:8px;color:#C4E5F8;font-size:12px;font-weight: 400;line-height:18px">' +
            params[index].seriesName +
            ':</span><span style="line-height:18px;margin-left:8px;color:' +
            params[index].color +
            '">' +
            params[index].value +
            '</span> <br />';
        }
        tip += '</div>';
      }
      return tip;
    },
  },
  legend: {
    data: ['A相电流（A）', 'B相电流（A）', 'C相电流（A）'],
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
    data: [
      '00：00',
      '02：00',
      '04：00',
      '06：00',
      '08：00',
      '10：00',
      '12：00',
      '14：00',
      '16：00',
      '18：00',
      '20：00',
      '22：00',
    ],
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    name: '单位/A',
    // nameGap: 15,
    // offset: 15,
    // nameTextStyle: {
    //   align: 'right',
    //   padding: 7,
    // },
    data: ['2', '4', '6', '8'],
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1A242B',
        width: 1,
      },
    },
  },
  grid: { top: '50px', left: '40px', right: '20px', bottom: '44px' },
  color: ['#287CE7', '#41E4DE', '#1DC129'],
  series: [
    {
      name: 'A相电流（A）',
      data: [1, 4, 1, 5, 1, 4, 1, 5, 3, 7, 4, 6],
      type: 'line',
      smooth: true,
      symbolSize: 0,
    },
    {
      name: 'B相电流（A）',
      data: [1, 2, 3, 2, 1, 4, 1, 5, 2, 6, 3, 7],
      type: 'line',
      smooth: true,
      symbolSize: 0,
    },
    {
      name: 'C相电流（A）',
      data: [2, 6, 2, 6, 2, 6, 2, 6, 1, 5, 2, 8],
      type: 'line',
      smooth: true,
      symbolSize: 0,
    },
  ],
};

chart_quantity.value = {
  type: 'quantity',
  tit: '用电量',
  xAxis: {
    type: 'category',
    data: [
      '00：00',
      '01：00',
      '02：00',
      '03：00',
      '04：00',
      '05：00',
      '06：00',
      '07：00',
      '08：00',
      '09：00',
      '10：00',
      '11：00',
      '12：00',
      '13：00',
      '14：00',
      '15：00',
      '16：00',
      '17：00',
      '18：00',
      '19：00',
      '20：00',
      '21：00',
      '22：00',
    ],
    axisTick: {
      show: false,
    },
    axisLabel: {
      interval: 1,
    },
  },
  color: 'rgba(40,124,232,0.5)',
  tooltip: {
    position: 'top',
    trigger: 'item',
    backgroundColor: 'rgba(11,34,52,0.9)',
    borderColor: '#204C6F',
    borderWidth: 1,
    formatter: (params: any) => {
      let tip: string = '';
      if (params != null) {
        tip += '<div>';
        tip +=
          '<p style="color: #41E4DE;font-size: 12px;font-weight: 400;">' +
          params.name +
          '</p><p><span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
          params.seriesName +
          '：</span><span style="color: #287CE7;font-size: 12px;font-weight: 400;">' +
          params.value +
          '</span></p>';
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
    name: '单位/kWh',
    data: ['1', '2', '3', '4'],
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
      name: '用电量（kWh）',
      data: [2.3, 2.0, 2.5, 3.0, 3.6, 2.1, 3.3, 1.2, 1.7, 2.1, 2.3, 3.1, 3.7, 3.8, 1.2, 2.5, 3.0],
      type: 'bar',
      itemStyle: {
        borderWidth: 1,
        borderColor: '#287CE8',
      },
      barWidth: 16,
      barGap: 70,
    },
  ],
  grid: { top: '50px', left: '40px', right: '20px', bottom: '44px' },
};

// 三相电流/三相电压曲线数据
const getThreeData = (symbol: string) => {
  if (symbol === 'current') {
    chart_current.value = {
      type: 'current',
      tit: '三相电流/电压曲线',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(11,34,52,0.9)',
        borderColor: '#204C6F',
        borderWidth: 1,
        formatter: (params: any) => {
          let tip: string = '';
          if (params != null && params.length > 0) {
            tip +=
              '<div style="width:125px;height:90px"><span style="margin-left:8px;color:#41E4DE;font-size:12px;font-weight: 400;line-height:18px">' +
              params[0].name +
              '</span><br />';
            for (let index = 0; index < params.length; index++) {
              tip +=
                '<span style="margin-left:8px;color:#C4E5F8;font-size:12px;font-weight: 400;line-height:18px">' +
                params[index].seriesName +
                ':</span><span style="line-height:18px;margin-left:8px;color:' +
                params[index].color +
                '">' +
                params[index].value +
                '</span> <br />';
            }
            tip += '</div>';
          }
          return tip;
        },
      },
      legend: {
        data: ['A相电流（A）', 'B相电流（A）', 'C相电流（A）'],
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: {
        type: 'category',
        data: [
          '00：00',
          '02：00',
          '04：00',
          '06：00',
          '08：00',
          '10：00',
          '12：00',
          '14：00',
          '16：00',
          '18：00',
          '20：00',
          '22：00',
        ],
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        name: '单位/A',
        // nameGap: 15,
        // offset: 15,
        // nameTextStyle: {
        //   align: 'right',
        //   padding: 7,
        // },
        data: ['2', '4', '6', '8'],
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#1A242B',
            width: 1,
          },
        },
      },
      grid: { top: '50px', left: '40px', right: '20px', bottom: '44px' },
      color: ['#287CE7', '#41E4DE', '#1DC129'],
      series: [
        {
          name: 'A相电流（A）',
          data: [1, 4, 1, 5, 1, 4, 1, 5, 3, 7, 4, 6],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'B相电流（A）',
          data: [1, 2, 3, 2, 1, 4, 1, 5, 2, 6, 3, 7],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'C相电流（A）',
          data: [2, 6, 2, 6, 2, 6, 2, 6, 1, 5, 2, 8],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
      ],
    };
  } else {
    chart_current.value = {
      type: 'current',
      tit: '三相电流/电压曲线',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(11,34,52,0.9)',
        borderColor: '#204C6F',
        borderWidth: 1,
        formatter: (params: any) => {
          let tip: string = '';
          if (params != null && params.length > 0) {
            tip +=
              '<div style="width:125px;height:90px"><span style="margin-left:8px;color:#41E4DE;font-size:12px;font-weight: 400;line-height:18px">' +
              params[0].name +
              '</span><br />';
            for (let index = 0; index < params.length; index++) {
              tip +=
                '<span style="margin-left:8px;color:#C4E5F8;font-size:12px;font-weight: 400;line-height:18px">' +
                params[index].seriesName +
                ':</span><span style="line-height:18px;margin-left:8px;color:' +
                params[index].color +
                '">' +
                params[index].value +
                '</span> <br />';
            }
            tip += '</div>';
          }
          return tip;
        },
      },
      legend: {
        data: ['A相电压（V）', 'B相电压（V）', 'C相电压（V）'],
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: {
        type: 'category',
        data: [
          '00：00',
          '02：00',
          '04：00',
          '06：00',
          '08：00',
          '10：00',
          '12：00',
          '14：00',
          '16：00',
          '18：00',
          '20：00',
          '22：00',
        ],
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        name: '单位/V',
        // nameGap: 15,
        // offset: 15,
        // nameTextStyle: {
        //   align: 'right',
        //   padding: 7,
        // },
        data: ['2', '4', '6', '8'],
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#1A242B',
            width: 1,
          },
        },
      },
      grid: { top: '50px', left: '40px', right: '20px', bottom: '44px' },
      color: ['#287CE7', '#41E4DE', '#1DC129'],
      series: [
        {
          name: 'A相电压（V）',
          data: [1, 4, 1, 5, 1, 4, 1, 5, 3, 7, 4, 6],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'B相电压（V）',
          data: [1, 2, 3, 2, 1, 4, 1, 5, 2, 6, 3, 7],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'C相电压（V）',
          data: [2, 6, 2, 6, 2, 6, 2, 6, 1, 5, 2, 8],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
      ],
    };
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-table) {
  background-color: transparent;
}

:deep(.el-table tr) {
  background-color: transparent;
}

:deep(.el-table__header) {
  border-collapse: collapse;
}

:deep(.el-table td.el-table__cell) {
  border: none;
}

:deep(.el-table th.el-table__cell.is-leaf) {
  border: none;
}

:deep(.el-table__inner-wrapper::before) {
  content: none;
}

.operations-analysis-water {
  min-width: 117px;
  min-height: 80px;
  background-color: rgba(0, 163, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .top-bg {
    width: 60px;
    height: 42px;
    background-color: rgba(0, 114, 179, 0.3);
    background-image: url('../src/assets/outer-bg.png');
    background-size: 24px 24px;
    background-position: center center;
    background-repeat: no-repeat;
    border: 1px solid rgba(0, 114, 179, 1);
    box-sizing: border-box;
    border-radius: 3px;
    cursor: pointer;
  }

  .bottom-font {
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    margin-top: 6px;
  }

  .model-wrapper-ftst {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;

    .model-content {
      width: 1800px;
      height: 95%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 1);
      box-sizing: border-box;
      border: 1px solid rgba(1, 52, 96, 1);

      .content-title {
        width: 100%;
        height: 52px;
        line-height: 52px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        background-image: url('../src/assets/title-bg.png');
        background-size: 100% 100%;
        border-bottom: 1px solid #013460;

        .left-title-font {
          display: flex;

          .font-icon {
            display: block;
            width: 24px;
            height: 24px;
            background-image: url('../src/assets/model-icon.png');
            background-size: 24px 24px;
            background-position: center center;
            background-repeat: no-repeat;
            margin-top: 14px;
          }

          .font-value {
            color: rgba(234, 245, 255, 1);
            font-size: 18px;
            margin-left: 15px;
          }
        }

        .right-close {
          width: 24px;
          height: 24px;
          // title-bg
          background-image: url('../src/assets/title-close.png');
          background-size: 14px 14px;
          background-position: center center;
          background-repeat: no-repeat;
          margin-top: 14px;
          cursor: pointer;
        }
      }

      .content-data {
        width: calc(100% - 60px);
        height: calc(100% - 112px);
        margin: 30px;
        overflow-y: scroll;

        .content-tab {
          width: 100%;
          height: 15vh;
          margin-bottom: 30px;

          .tab-con {
            height: 16px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #eaf5ff;
            margin-bottom: 20px;
          }

          .tab {
            width: 100%;
            height: calc(100% - 16px);
          }
        }

        .content-chart {
          width: 100%;
          height: 80vh;

          .tab-con {
            height: 16px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #eaf5ff;
            margin-bottom: 20px;
          }

          .tab-chart {
            height: calc(80vh - 36px);
            display: grid;
            grid-template-columns: 50% 50%;
            grid-template-rows: 50% 50%;
          }
        }
      }
    }
  }
}
</style>
