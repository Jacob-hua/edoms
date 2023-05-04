<template>
  <div class="wrap-body">
    <div class="wrap-body-top">
      <img class="icon-left" src="../assets/icon.png" alt="" />
      <span class="elefont">电能质量</span>
    </div>
    <div class="wrap-body-bottom">
      <el-tabs type="border-card">
        <el-tab-pane class="tab">
          <template #label>
            <span class="custom-tabs-label">
              <span>三相不平衡</span>
            </span>
          </template>
          <div v-for="item in categories" :key="item.name" class="dataEchart">
            <el-row class="row-bg">
              <el-col :span="10"
                ><div class="grid-content ep-bg-purple row-bg-left" />
                <p style="color: #fff; font-size: 14px; text-align: center">{{ item.position.label }}</p>
                <p style="color: #fff; font-size: 14px; text-align: center">
                  <span style="color: #00fff0; font-size: 20px">{{ item.position.value }}</span
                  >kv
                </p>
              </el-col>
              <el-col :span="8"
                ><div class="grid-content ep-bg-purple-light" />
                <div class="row-right">
                  <p>
                    <span style="color: #41e4de; font-size: 20px">{{ item.position.time }}</span
                    >小时
                  </p>
                  <p>当月累计时长</p>
                </div>
                <div class="row-right" style="margin: 20px 0px 20px 20px">
                  <p>
                    <span style="color: #41e4de; font-size: 20px">{{ item.position.day }}</span
                    >天
                  </p>
                  <p>当月天数</p>
                </div>
                <div class="row-right">
                  <p>
                    <span style="color: #41e4de; font-size: 20px">{{ item.position.max_rate }}</span
                    >%
                  </p>
                  <p>最大不平衡率</p>
                </div>
              </el-col>
            </el-row>
            <Proportion
              class="echart"
              style="width: 300px; border-right: 1px solid #212c3c"
              :option="option_prop"
            ></Proportion>
            <CurrentChart class="echart" :option="option_current"></CurrentChart>
            <LoadChart class="echart" :option="option_load"></LoadChart>
          </div>
        </el-tab-pane>
        <el-tab-pane class="tab" label="功率因素">功率因素</el-tab-pane>
        <el-tab-pane class="tab" label="电压分析">电压分析</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { ECOption } from '../../types';

import CurrentChart from './component/CurrentChart.vue';
import LoadChart from './component/LoadChart.vue';
// import useApp from '../../useApp';
import Proportion from './component/Proportion.vue';
import { ElectricEnergyQuality } from './type';

defineProps<{
  config: ElectricEnergyQuality;
}>();

// const { request } = useApp(props);
// 占比分布
const option_prop = ref<ECOption>({});
// 电流
const option_current = ref<ECOption>({});
// 负载率
const option_load = ref<ECOption>({});

option_prop.value = {
  tooltip: {
    trigger: 'item',
    confine: true,
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

  color: ['#287ce7', '#747df8', '#21a768', '#41e4de'],
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      top: 40,
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'outside',
        formatter: '{d}%',
        color: '#fff',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 5,
      },
      data: [
        { value: 60.17, name: '<15%' },
        { value: 19.56, name: '15%-30%' },
        { value: 15.42, name: '30%-50%' },
        { value: 0.85, name: '>50%' },
      ],
    },
  ],
};
option_current.value = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['La', 'Lb', 'Lc'],
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
    name: 'A',
    data: ['1', '2', '3', '4', '5', '6', '7', '8'],
  },
  yAxis: {
    type: 'value',
    name: 'B',
    data: ['2', '4', '6', '8'],
  },
  color: ['#287CE7', '#38AE1C', '#C1721D', '#41e4de'],
  series: [
    {
      name: 'La',
      data: [1, 4, 1, 5, 1, 4, 1, 5],
      type: 'line',
      smooth: true,
    },
    {
      name: 'Lb',
      data: [1, 2, 3, 2, 1, 4, 1, 5],
      type: 'line',
      smooth: true,
    },
    {
      name: 'Lc',
      data: [2, 6, 2, 6, 2, 6, 2, 6],
      type: 'line',
      smooth: true,
    },
  ],
};
option_load.value = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['负载率', '三相不平衡率'],
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
    name: 'A',
    data: ['1', '2', '3', '4', '5', '6', '7', '8'],
  },
  yAxis: [
    {
      type: 'value',
      name: 'B',
      data: ['2', '4', '6', '8'],
    },
    {
      type: 'category',
      name: '%',
      data: ['20%', '40%', '60%', '80%'],
    },
  ],
  color: ['#41E4DE', '#38AE1C', '#21a768', '#41e4de'],
  series: [
    {
      name: '负载率',
      data: [1, 4, 1, 5, 1, 4, 1, 5],
      type: 'line',
      smooth: true,
    },
    {
      name: '三相不平衡率',
      data: [1, 2, 3, 2, 1, 4, 1, 5],
      type: 'line',
      smooth: true,
    },
  ],
};

const categories = ref([
  {
    label1: '占比分布',
    label2: '电流',
    label3: '负载率',
    position: {
      label: 'AH6 B楼1#变压器',
      value: 10,
      time: 377,
      day: 16,
      max_rate: 9.52,
    },
    name: 'systems',
  },
  {
    label1: '占比分布',
    label2: '电流',
    label3: '负载率',
    position: {
      label: 'AH7 B楼1#变压器',
      value: 10,
      time: 377,
      day: 16,
      max_rate: 9.52,
    },
    name: 'systems',
  },
]);
</script>

<style lang="scss" scoped>
:deep(.el-tabs--border-card > .el-tabs__header) {
  background-color: rgba(0, 0, 0, 1) !important;
  border-bottom: none;
}
:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
  background-color: rgba(0, 42, 66, 1) !important;
  color: #ffffff;
  border: 1px solid #007bc0;
}

:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
  width: 130px;
  height: 34px;
  background: rgba(0, 20, 31, 1);
  color: rgba(234, 245, 255, 1);
  border: 1px solid #007bc0;
  margin: 30px 20px 0px 30px;
  text-align: center;
  line-height: 34px;
}

:deep(.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}

:deep(.el-tabs__nav) {
  height: 65px;
}
.wrap-body {
  width: 100%;
  min-width: 822px;
  min-height: 364px;
  .wrap-body-top {
    width: 100%;
    height: 52px;
    background-color: rgba(7, 29, 56, 1);
    .icon-left {
      width: 23px;
      height: 23px;
      margin: 15px 15px 10px 14px;
    }
    .elefont {
      color: rgba(234, 245, 255, 1);
      font-size: 18px;
      margin-top: 20px;
    }
  }
  .wrap-body-bottom {
    width: 100%;
    height: 788px;
    background-color: rgba(0, 0, 0, 1);
    .el-tabs--border-card {
      background-color: rgba(0, 0, 0, 1);
    }
    .dataEchart {
      height: 316px;
      border: 1px solid #212c3c;
      margin: 30px 30px;
      .row-bg {
        width: 304px;
        height: 280px;
        margin: 20px;
        float: left;
        border-right: 1px solid #212c3c;
        .row-bg-left {
          margin-top: 90%;
        }
        .row-right {
          width: 130px;
          height: 76px;
          line-height: 35px;
          text-align: center;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #eaf5ff;
          background: rgba(3, 18, 28, 1);
          border: 1px solid #0072b3;
          border-radius: 4px;
          margin-left: 20px;
        }
      }
      .echart {
        float: left;
        height: 280px;
        margin: 20px 20px 20px 0px;
        color: #eaf5ff;
      }
    }
  }
}
</style>
