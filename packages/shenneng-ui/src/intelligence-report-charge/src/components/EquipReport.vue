<template>
  <div class="operations-analysis-pv">
    <div class="other" style="display: flex">
      <div class="selest-time">
        <TimeCalendar :option="timeType"></TimeCalendar>
      </div>

      <div class="button-box">
        <el-button size="small" type="primary" plain>{{ t('查询') }}</el-button>
        <el-button size="small" type="primary" plain>{{ t('导出') }}</el-button>
      </div>
    </div>

    <div class="chart-pv">
      <div class="chart-left">
        <div class="tit">{{ t('设备剩余寿命') }}</div>
        <div class="charts" style="position: relative">
          <ElButton class="upbut" size="small" type="primary" :icon="ArrowUp" plain @click="backEchartData"></ElButton>
          <EdomsCharts style="height: 100%" :option="option"></EdomsCharts>
          <ElButton
            class="downbut"
            size="small"
            type="primary"
            :icon="ArrowDown"
            plain
            @click="nextEchartData"
          ></ElButton>
        </div>
      </div>
      <div class="chart-right">
        <div class="tit">{{ t('设备状态') }}</div>
        <EdomsCharts class="charts" :option="optionPie"></EdomsCharts>
      </div>
    </div>

    <div class="table-inner">
      <el-table border :data="tableData" size="mini" highlight-current-row height="50vh" fit style="width: 100%">
        <el-table-column :label="t('充电桩')" prop="index" align="center" />
        <el-table-column :label="t('设备编码')" prop="code" align="center" />
        <el-table-column width="170" :label="t('设备名称')" prop="name" align="center" />
        <el-table-column :label="t('整机效率')" prop="efficiency" align="center" />
        <el-table-column :label="t('设备健康率')" prop="healthy" align="center" />
        <el-table-column width="160" :label="t('联系人')" prop="connect" align="center" />
        <el-table-column :label="t('设计寿命h')" prop="designLife" align="center" />
        <el-table-column :label="t('剩余寿命h')" prop="restLife" align="center" />
        <el-table-column :label="t('设备状态')" prop="state" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import useI18n from '../../../useI18n';

import TimeCalendar from './TimeCalendar.vue';

const { t } = useI18n();

const timeType = ref<string>('date');
const option = ref<ECOption>({});
const optionPie = ref<ECOption>({});
const ydata = ref([
  '1-9充电桩',
  '1-8充电桩',
  '1-7充电桩',
  '1-6充电桩',
  '1-5充电桩',
  '1-4充电桩',
  '1-3充电桩',
  '1-2充电桩',
  '1-1充电桩',
]);
const valData = ref([580, 900, 150, 750, 600, 500, 650, 850, 800]);
option.value = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {},

  grid: {
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '5%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    name: '(h)',
    splitLine: {
      show: false,
    },
    axisLine: {
      show: true,
    },
    boundaryGap: [0, 0.01],
  },
  yAxis: {
    type: 'category',
    splitLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    data: ydata.value,
  },
  series: [
    {
      type: 'bar',
      itemStyle: {
        borderWidth: 1,
        color: function (p) {
          if (p.name === '1-7充电桩') {
            return '#975602';
          } else {
            return '#1F6917';
          }
        },
      },
      label: {
        show: true,
        position: 'right', // 位置
        color: '#fff',
        fontSize: 14,
        distance: 15, // 距离
        //formatter: '{c}%' // 这里是数据展示的时候显示的数据
      },
      data: valData.value,
      barWidth: 12,
      barGap: 70,
    },
  ],
};
const colorList = ['#9B5703', '#03659D', '#246B15'];
const data1 = [
  {
    name: t('投运中'),
    value: 85,
  },
  {
    name: t('未投运'),
    value: 60,
  },
  {
    name: t('报废'),
    value: 55,
  },
];
optionPie.value = {
  title: {
    text: '200',
    textStyle: {
      color: '#EAF5FF',
    },
    top: 'center',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    bottom: 10,
    itemWidth: 14,
    itemHeight: 14,
    textStyle: {
      color: '#fff',
    },
  },
  series: [
    {
      // @ts-ignore
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['34%', '55%'],
      clockwise: true,
      avoidLabelOverlap: true,
      hoverOffset: 15,
      itemStyle: {
        // @ts-ignore
        normal: {
          color: function (params: any) {
            return colorList[params.dataIndex];
          },
        },
      },
      label: {
        show: true,
        position: 'outside',
        fontSize: 14,
        fontWeight: 'normal',
        color: 'inherit',
        borderColor: 'transparent',
        formatter: function (params) {
          if (params.name !== '') {
            return params.name + '\n' + '\n' + params.value;
          } else {
            return '';
          }
        },
      },
      labelLine: {
        // @ts-ignore
        normal: {
          length: 20,
          length2: 30,
          lineStyle: {
            width: 1,
          },
        },
      },
      data: data1,
    },
  ],
};
const tableData = ref([
  {
    index: '1-1#充电桩',
    code: '001',
    name: '60KW双向32V充电桩',
    efficiency: '96%',
    healthy: '51%',
    connect: '张三 18919399675',
    designLife: 1500,
    restLife: 96.4,
    state: '投运中',
  },
  {
    index: '1-2#充电桩',
    code: '002',
    name: '60KW双向32V充电桩',
    efficiency: '86%',
    healthy: '64%',
    connect: '张三 18919399675',
    designLife: 2600,
    restLife: 90.2,
    state: '投运中',
  },
  {
    index: '1-3#充电桩',
    code: '003',
    name: '60KW双向32V充电桩',
    efficiency: '95%',
    healthy: '92%',
    connect: '张三 18919399675',
    designLife: 2600,
    restLife: 98.8,
    state: '投运中',
  },
  {
    index: '1-4#充电桩',
    code: '004',
    name: '60KW双向32V充电桩',
    efficiency: '89%',
    healthy: '86%',
    connect: '张三 18919399675',
    designLife: 1500,
    restLife: 88.7,
    state: '投运中',
  },
  {
    index: '1-5#充电桩',
    code: '005',
    name: '60KW双向32V充电桩',
    efficiency: '89%',
    healthy: '86%',
    connect: '张三 18919399675',
    designLife: 1654,
    restLife: 76.7,
    state: '投运中',
  },
  {
    index: '1-6#充电桩',
    code: '006',
    name: '60KW双向32V充电桩',
    efficiency: '86%',
    healthy: '89%',
    connect: '张三 18919399675',
    designLife: 1654,
    restLife: 80.7,
    state: '投运中',
  },
  {
    index: '1-7#充电桩',
    code: '007',
    name: '60KW双向32V充电桩',
    efficiency: '96%',
    healthy: '94%',
    connect: '张三 18919399675',
    designLife: 1654,
    restLife: 94.6,
    state: '投运中',
  },
  {
    index: '1-8#充电桩',
    code: '008',
    name: '60KW双向32V充电桩',
    efficiency: '99%',
    healthy: '98%',
    connect: '张三 18919399675',
    designLife: 1654,
    restLife: 98.5,
    state: '投运中',
  },
  {
    index: '1-9#充电桩',
    code: '009',
    name: '60KW双向32V充电桩',
    efficiency: '96%',
    healthy: '96.2%',
    connect: '张三 18919399675',
    designLife: 1654,
    restLife: 96.4,
    state: '投运中',
  },
  {
    index: '1-10#充电桩',
    code: '010',
    name: '60KW双向32V充电桩',
    efficiency: '87%',
    healthy: '86.4%',
    connect: '张三 18919399675',
    designLife: 1654,
    restLife: 86.3,
    state: '投运中',
  },
]);
// 上一条柱状图数据
const backEchartData = () => {
  if (ydata.value[ydata.value.length - 1].split('-')[1].split('充')[0] === '1') {
    return;
  }
  ydata.value.shift();
  ydata.value.push('1-' + (Number(ydata.value[ydata.value.length - 1].split('-')[1].split('充')[0]) - 1) + '充电桩');
  valData.value.shift();
  valData.value.push(Math.round(Math.random() * 1000));
};
// 下一条柱状图数据
const nextEchartData = () => {
  ydata.value.pop();
  ydata.value.unshift('1-' + (Number(ydata.value[0].split('-')[1].split('充')[0]) + 1) + '充电桩');
  valData.value.pop();
  valData.value.unshift(Math.round(Math.random() * 1000));
};
</script>

<style lang="scss" scoped>
.operations-analysis-pv {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;

  .other {
    border-bottom: 1px solid #1d2634;
    border-top: 1px solid #1d2634;
    padding: 12px 0;
    margin-top: 24px;
    display: flex;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: transparent;
  }

  :deep(.el-button--primary.is-plain) {
    background-color: transparent;
  }

  :deep(.el-table__header) {
    background-color: transparent;
  }

  :deep(.el-table th.el-table__cell.is-leaf) {
    background-color: transparent !important;
  }

  :deep(.el-table tr, .el-table thead) {
    background-color: transparent;
  }

  :deep(.table-inner .el-table) {
    background-color: transparent;
  }

  :deep(.el-table tbody tr:hover > td) {
    background-color: transparent !important; //修改成自己想要的颜色即可
  }

  :deep(.el-table) {
    color: #eaf5ff !important;
    --el-table-border-color: #151c26;
    --el-table-row-hover-bg-color: #05070a;
    --el-table-current-row-bg-color: #05070a;
  }

  :deep(.el-table thead) {
    color: #eaf5ff;
  }

  :deep(.el-table--border .el-table__cell) {
    border: 1px solid #151c26;
  }

  :deep(.el-scrollbar__view) {
    height: 100%;
  }

  :deep(.el-table__body) {
    height: 100%;
  }

  .button-box {
    margin-left: 20px;

    button {
      width: 80px;
      height: 32px;
      background: rgba(0, 163, 255, 0.26) !important;
      border: 1px solid #007bc0;
      border-radius: 4px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #eaf5ff;
    }
  }

  .chart-pv {
    margin-top: 20px;
    width: 100%;
    height: 480px;
    //background: red;
    display: flex;
    justify-content: space-between;

    .chart-left,
    .chart-right {
      width: 49%;
      height: 100%;
      margin: 0px 30px;

      .tit {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #eaf5ff;
      }

      //background: greenyellow;
      .charts {
        width: 100%;
        height: 440px;
        background: rgba(9, 15, 23, 0.3);
        border: 1px solid #212c3c;

        .upbut {
          position: absolute;
          left: 40px;
          top: 20px;
          width: 50px;
          height: 20px;
          background: rgba(0, 163, 255, 0.4);
          border-radius: 2px;
          text-align: center;
          line-height: 20px;
          z-index: 999;
          color: #eaf5ff;
          cursor: pointer;
          border: 0;
        }

        .downbut {
          position: absolute;
          left: 40px;
          bottom: 20px;
          width: 50px;
          height: 20px;
          background: rgba(0, 163, 255, 0.4);
          border-radius: 2px;
          text-align: center;
          line-height: 20px;
          z-index: 999;
          color: #eaf5ff;
          cursor: pointer;
          border: 0;
        }
      }
    }

    .chart-right {
      position: relative;

      .all-num {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 99999;
      }
    }
  }

  .table-inner {
    margin: 20px 30px 0px;
  }
}
</style>
