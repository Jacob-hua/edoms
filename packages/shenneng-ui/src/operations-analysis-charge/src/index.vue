<template>
  <div class="operations-analysis-charge" @click="handlerToShow($event, true)">
    <div class="wrap-report">
      <div class="wrap-icon">
        <img class="icon-report" src="./assets/outer-bg.png" alt="" />
      </div>
      <div class="label">{{ config.title }}</div>
    </div>
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
          <div class="station-sel">
            <span>设备选择：</span>
            <el-select v-model="eq_value" popper-class="eq-select" class="m-2" placeholder="Select" @change="selectEq">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="station-tab">
            <el-tabs v-model="st_value" @tab-click="handleClickTab">
              <el-tab-pane v-for="item in stationData" :key="item.name" :label="item.label" :name="item.name">
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="station-but">
            <el-tabs v-model="type_value" @tab-click="handleClickType">
              <el-tab-pane label="正向充电" name="forward"> </el-tab-pane>
              <el-tab-pane label="反向充电" name="reverse"> </el-tab-pane>
            </el-tabs>

            <!-- <el-button v-for="item in stationType" :key="item.name" @click="handleClickType">{{ item.type }}</el-button> -->
          </div>
          <div class="station-con">
            <div class="charging-cap">
              <Chartcom :option="charging_option"></Chartcom>
            </div>
            <div class="operating-par">
              <Chartcom :option="operating_option"></Chartcom>
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

import Chartcom from './components/Chartcom.vue';
import { OperationsAnalysisCharge } from './type';
// 充电量
const charging_option = ref<ECOption>({});
// 运行参数
const operating_option = ref<ECOption>({});

defineProps<{
  config: OperationsAnalysisCharge;
}>();
const isShowModel = ref<boolean>(false);
const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};
const eq_value = ref('frist');
const st_value = ref('1-1');
const type_value = ref('forward');
const options = [
  {
    value: 'frist',
    label: '1#充电桩',
  },
  {
    value: 'second',
    label: '2#充电桩',
  },
];
const stationData = [
  {
    label: '1-1充电桩',
    name: '1-1',
  },
  {
    label: '1-2充电桩',
    name: '1-2',
  },
  {
    label: '1-3充电桩',
    name: '1-3',
  },
  {
    label: '1-4充电桩',
    name: '1-4',
  },
  {
    label: '1-5充电桩',
    name: '1-5',
  },
];

const getChartData = () => {
  charging_option.value = {
    tit: '充电量监测',
    grid: {
      top: 40,
      left: 30,
      right: 30,
      bottom: 40,
    },
    xAxis: {
      type: 'category',
      data: [
        '00:00',
        '02:00',
        '04:00',
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00',
        '16:00',
        '18:00',
        '20:00',
        '22:00',
      ],
      axisLabel: {
        interval: 0,
      },
      axisTick: {
        show: false,
      },
    },
    color: ['#287CE7', '#38AE1C'],
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
              '<p><span style="width:160px;display: inline-block;color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
              params[index].seriesName +
              '：</span><span style="color:' +
              params[index].color +
              '">' +
              params[index].value +
              'kWh</span></p>';
          }
          tip +=
            '<p><span style="width:160px;display: inline-block;color:#F5F7FA;font-size: 12px;font-weight: 400;">差值：</span><span style="color:#FF8A00">' +
            Number(params[0].value - params[1].value) +
            'kWh</span></p></div>';
        }
        return tip;
      },
    },
    legend: {
      top: '5%',
      left: 'center',
      itemWidth: 15,
      itemHeight: 8,
      textStyle: {
        color: '#fff',
      },
    },
    yAxis: {
      type: 'value',
      name: '单位/kWh',
      nameTextStyle: {
        // lineHeight: 28,
        padding: [0, 10, 0, 0],
        fontSize: '10',
        fontFamily: 'Microsoft YaHei',
        fontWeight: 300,
        color: '#D8D8D8',
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#1A242B',
          width: 1,
        },
      },
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        name: 'DC-AC（车-充电桩）输入',
        data: [100, 150, 200, 250, 300, 350, 200, 150, 250, 300, 105, 205],
        type: 'line',
        smooth: true,
        symbolSize: 0,
      },
      {
        name: 'DC-AC（充电桩-电网）输出',
        data: [200, 120, 300, 100, 350, 250, 200, 100, 300, 200, 205, 350],
        type: 'line',
        smooth: true,
        symbolSize: 0,
      },
    ],
  };
  operating_option.value = {
    tit: '运行参数监测',
    grid: {
      top: 40,
      left: 30,
      right: 30,
      bottom: 40,
    },
    xAxis: {
      type: 'category',
      data: [
        '00:00',
        '02:00',
        '04:00',
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00',
        '16:00',
        '18:00',
        '20:00',
        '22:00',
      ],
      axisLabel: {
        interval: 0,
      },
      axisTick: {
        show: false,
      },
    },
    color: ['#0080ED', '#38AE1C', '#FF8A00'],
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
              '<p><span style="width:100px;display: inline-block;color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
              params[index].seriesName +
              '：</span><span style="color:' +
              params[index].color +
              '">' +
              params[index].value +
              'kWh</span></p>';
          }
          tip += '</div>';
        }
        return tip;
      },
    },
    legend: {
      top: '5%',
      left: 'center',
      itemWidth: 15,
      itemHeight: 8,
      textStyle: {
        color: '#fff',
      },
    },
    yAxis: {
      type: 'value',
      name: '单位/kWh',
      nameTextStyle: {
        // lineHeight: 28,
        padding: [0, 10, 0, 0],
        fontSize: '10',
        fontFamily: 'Microsoft YaHei',
        fontWeight: 300,
        color: '#D8D8D8',
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#1A242B',
          width: 1,
        },
      },
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        name: 'DC-AC输入电压',
        data: [200, 400, 250, 700, 200, 400, 250, 700, 200, 400, 250, 700],
        type: 'line',
        smooth: true,
        symbolSize: 0,
      },
      {
        name: 'DC-AC输入电流',
        data: [100, 150, 120, 200, 100, 150, 120, 200, 100, 150, 120, 200],
        type: 'line',
        smooth: true,
        symbolSize: 0,
      },
      {
        name: 'DC-AC输出电流',
        data: [90, 120, 140, 160, 90, 120, 140, 160, 90, 120, 140, 160],
        type: 'line',
        smooth: true,
        symbolSize: 0,
      },
    ],
  };
};
getChartData();
const selectEq = (event: any) => {
  console.log(event);
  getChartData();
};
const handleClickTab = (event: any) => {
  console.log(event);
  getChartData();
};
const handleClickType = (event: any) => {
  console.log(event);
  getChartData();
};
</script>

<style lang="scss" scoped>
:deep(.el-select) {
  width: 180px;
  height: 32px;
  color: aqua !important;
  // margin-right: 20px;
}

:deep(.el-input__wrapper) {
  background: #010101;
  border: 1px solid #454e72;
  border-radius: 4px;
  box-shadow: none;
}

:deep(.el-input__inner) {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
}

:deep(.el-tabs__nav-wrap::after) {
  content: none;
}

:deep(.el-tabs) {
  --el-tabs-header-height: 56px !important;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #b8b8b8;
}

:deep(.el-tabs__item.is-active) {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #0080ed;
}

:deep(.el-tabs__active-bar) {
  background-color: #0080ed;
}

// :deep(.station-but > .el-tabs > .el-tabs__item) {
//   width: 92px;
//   height: 32px;
// }

:deep(.station-but > .el-tabs > .el-tabs__header > .el-tabs__nav-wrap > .el-tabs__nav-scroll > .el-tabs__nav) {
  .el-tabs__item {
    width: 92px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    background: #00111a;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 300;
    color: #c4e5f8;
    padding: 0;
    margin-right: 15px;
  }

  .el-tabs__item:last-child {
    margin-left: 15px;
  }

  .el-tabs__item:last-child::after {
    content: '';
    display: inline-block;
    position: absolute;
    left: -15px;
    top: 5px;
    opacity: 0.4;
    width: 1px;
    height: 20px;
    background: #00a3ff;
  }

  .el-tabs__item.is-active {
    background: rgba(0, 163, 255, 0.16);
    border: 1px solid #007bc0;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }

  .el-tabs__active-bar {
    display: none;
  }
}

.operations-analysis-charge {
  min-height: 80px;
  position: relative;

  .wrap-report {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .wrap-icon {
      width: 60px;
      height: 42px;
      margin-top: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 114, 179, 0.4);
      border: 1px solid #0072b3;
      border-radius: 4px;
      box-sizing: border-box;

      .icon-report {
        width: 22px;
        height: 24px;
      }
    }

    .label {
      margin-top: 7px;
      font-size: 14px;
      color: #ffffff;
      font-weight: 300;
    }
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
      width: 1400px;
      height: 80%;
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
        width: 100%;
        height: calc(100% - 52px);
        overflow-y: scroll;

        .station-sel {
          border-bottom: 1px solid #1d2634;
          height: 32px;
          padding: 23px 30px;

          span {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #eaf5ff;
          }
        }

        .station-tab {
          height: 56px;
          padding-left: 30px;
          border-bottom: 1px solid #1d2634;
        }

        .station-but {
          height: 32px;
          padding: 20px 30px;
        }

        .station-con {
          width: 100%;
          height: 70%;
          display: flex;

          .charging-cap {
            width: 50%;
            margin: 0 30px 30px;
          }

          .operating-par {
            width: 50%;
            margin: 0 30px 30px;
          }
        }
      }
    }
  }
}
</style>
