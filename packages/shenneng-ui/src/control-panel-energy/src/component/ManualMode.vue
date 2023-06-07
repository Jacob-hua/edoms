<template>
  <el-card class="info-card">
    <div class="anticipate">
      <div class="anticipate-info">
        <div>
          <span>当前状态：</span>
          <span class="anticipate-value">{{ manualStatus.currentStatus }}</span>
        </div>
        <div>
          <span>供电功率：</span>
          <span class="anticipate-value">{{ manualStatus.power ? manualStatus.power + 'kW' : '' }}</span>
        </div>
      </div>
      <div class="btn">
        <el-button @click="handleSetting">设置</el-button>
      </div>
    </div>
    <div class="chart-box">
      <EdomsCharts class="chart-container" :option="options"></EdomsCharts>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

// import { dateRange } from '@edoms/utils';
import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';

withDefaults(
  defineProps<{
    manualStatus: any;
  }>(),
  {
    manualStatus: {
      currentStatus: '供电',
      power: '100',
    },
  }
);

const emit = defineEmits<{
  (event: 'settingAction', data: boolean): void;
}>();

const options = computed<ECOption>(() => {
  return {
    grid: {
      top: 60,
      left: 65,
      right: 30,
      bottom: 30,
    },
    textStyle: {
      color: '#D8D8D8',
    },
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
              '<p><span style="color: #F5F7FA">当前状态：</span><span style="color: ' +
              params[index].color +
              '">' +
              (params[index].value < 0 ? '充电' : '供电') +
              '</span></p>' +
              '<p><span style="color: #F5F7FA">' +
              (params[index].value < 0 ? '充电功率' : '供电功率') +
              '：</span><span style="color:' +
              params[index].color +
              '">' +
              params[index].value +
              'kW</span></p>';
          }
          tip += '</div>';
        }
        return tip;
      },
    },
    legend: {
      itemWidth: 14,
      itemHeight: 14,
      selectedMode: false,
      data: [
        {
          name: '充电功率',
          icon: 'rect',
          textStyle: { color: '#EFF7FF' },
          itemStyle: { color: 'rgba(40,124,231,0.6)', borderColor: '#287CE7', borderWidth: 1 },
        },
        {
          name: '供电功率',
          icon: 'rect',
          textStyle: { color: '#EFF7FF' },
          itemStyle: { color: 'rgba(56,174,28,0.6)', borderColor: '#38AE1C', borderWidth: 1 },
        },
      ],
    },
    xAxis: {
      type: 'category',
      data: [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
      ],
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      name: `kW`,
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ffffff85',
        },
      },
    },
    color: ['rgba(54,153,255,0.6)'],
    series: [
      {
        name: '充电功率',
        type: 'bar',
        barWidth: '24px',
        data: [
          -800,
          -760,
          -750,
          -175,
          -170,
          -100,
          -100,
          -100,
          -100,
          -50,
          { value: 800, itemStyle: { color: 'rgba(47,218,47,0.6)', borderColor: '#2FDA2F', borderWidth: 1 } },
          { value: 950, itemStyle: { color: 'rgba(47,218,47,0.6)', borderColor: '#2FDA2F', borderWidth: 1 } },
          -750,
          -650,
          { value: 600, itemStyle: { color: 'rgba(47,218,47,0.6)', borderColor: '#2FDA2F', borderWidth: 1 } },
        ],
      },
      {
        name: '供电功率',
        type: 'bar',
        data: [],
      },
    ],
  };
});

const handleSetting = () => {
  console.log(111);
  emit('settingAction', true);
};
</script>

<style lang="scss" scoped>
.info-card {
  --el-card-bg-color: rgba(9, 15, 23, 0.3);
  --el-card-border-color: rgba(1, 52, 96, 1);
  --el-text-color-primary: rgba(234, 245, 255, 1);
  // background: rgba(9, 15, 23, 0.3);

  .anticipate {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    grid-column-gap: 22px;
    align-items: center;

    .anticipate-info {
      display: grid;
      grid-auto-flow: column;
      grid-column-gap: 60px;

      .anticipate-value {
        color: rgba(56, 208, 20, 1);
      }
    }
  }

  .chart-container {
    height: 450px;
    width: 100%;
  }
}
</style>
