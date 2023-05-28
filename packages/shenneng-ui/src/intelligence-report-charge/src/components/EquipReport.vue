<template>
  <div class="operations-analysis-pv">
    <div class="other" style="display: flex">
      <div class="selest-time">
        <TimeCalendar :option="timeType"></TimeCalendar>
      </div>

      <div class="button-box">
        <el-button size="small" type="primary" plain>查询</el-button>
        <el-button size="small" type="primary" plain>导出</el-button>
      </div>
    </div>

    <div class="chart-pv">
      <div class="chart-left">
        <EdomsCharts class="charts" :option="option"></EdomsCharts>
      </div>
      <div class="chart-right">
        <span class="all-num">200</span>
        <EdomsCharts class="charts" :option="optionPie"></EdomsCharts>
      </div>
    </div>

    <div class="table-inner">
      <el-table border :data="tableData" size="mini" highlight-current-row height="50vh" fit style="width: 100%">
        <el-table-column label="充电桩" prop="index" align="center" />
        <el-table-column label="设备编码" prop="code" align="center" />
        <el-table-column width="170" label="设备名称" prop="name" align="center" />
        <el-table-column label="整机效率" prop="efficiency" align="center" />
        <el-table-column label="设备健康率" prop="healthy" align="center" />
        <el-table-column width="160" label="联系人" prop="connect" align="center" />
        <el-table-column label="设计寿命(h)" prop="designLife" align="center" />
        <el-table-column label="剩余寿命(h)" prop="restLife" align="center" />
        <el-table-column label="设备状态" prop="state" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';

import TimeCalendar from './TimeCalendar.vue';

const timeType = ref<string>('date');
const option = ref<ECOption>({});
const optionPie = ref<ECOption>({});
option.value = {
  backgroundColor: '#030507',
  title: {
    text: '设备剩余寿命',
    textStyle: {
      color: '#fff',
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {},

  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
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
    data: [
      '1-1充电桩',
      '1-2充电桩',
      '1-3充电桩',
      '1-4充电桩',
      '1-5充电桩',
      '1-6充电桩',
      '1-7充电桩',
      '1-8充电桩',
      '1-9充电桩',
    ].reverse(),
  },
  series: [
    {
      type: 'bar',
      itemStyle: {
        // color:'#1C6F0F',
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
      data: [800, 850, 650, 500, 600, 750, 150, 900, 580].reverse(),
      barWidth: 16,
      barGap: 70,
    },
  ],
};
const colorList = ['#9B5703', '#03659D', '#246B15'];
const data1 = [
  {
    name: '投运中',
    value: 85,
  },
  {
    name: '未投运',
    value: 60,
  },
  {
    name: '报废',
    value: 55,
  },
];
optionPie.value = {
  backgroundColor: '#030507',
  title: {
    text: '设备状态',
    textStyle: {
      color: '#fff',
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    bottom: 10,
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
</script>

<style lang="scss" scoped>
.operations-analysis-pv {
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: auto;
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
    border-left-color: rgb(144, 147, 153) !important;
    border-right-color: rgb(144, 147, 153) !important;
    background: transparent;
  }
  :deep(.el-table th.el-table__cell.is-leaf) {
    background-color: transparent !important;
  }
  //rgb(144, 147, 153)
  :deep(.el-table td.el-table__cell) {
    border-color: rgb(144, 147, 153) !important;
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
  .button-box {
    margin-left: 50px;
  }
  .chart-pv {
    margin-top: 20px;
    width: 100%;
    height: 400px;
    //background: red;
    display: flex;
    justify-content: space-between;
    .chart-left,
    .chart-right {
      width: 49%;
      height: 100%;
      //background: greenyellow;
      .charts {
        width: 100%;
        height: 400px;
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
    margin-top: 20px;
  }
}
</style>
