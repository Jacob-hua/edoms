<template>
  <div v-for="(item, index) in data" :key="index" class="dataEchart">
    <div class="dataEchart_frist">
      <div class="df_left">
        <p class="position_data">{{ item.label }}</p>
        <div class="value_data_con">
          <p class="value_data">
            <span>{{ item.voltage }}</span> kv
          </p>
        </div>
      </div>
      <div class="text_clm">
        <div class="text_row">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.monthTime }}</span
            >{{ t('小时') }}
          </div>
          <div>{{ t('当月累计时长') }}</div>
        </div>
        <div class="text_row">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.monthDay }}</span
            >{{ t('天') }}
          </div>
          <div>{{ t('当月天数') }}</div>
        </div>
        <div class="text_row">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.maxRate }}</span
            >%
          </div>
          <div>{{ t('最大不平衡率') }}</div>
        </div>
      </div>
    </div>
    <div class="dataEchart_second">
      <div class="wrapper">
        <div class="echart">{{ t('占比分布') }}</div>
        <EdomsCharts class="charts" :option="proportionDistributionConfig(item.workRatio)"></EdomsCharts>
      </div>
    </div>
    <div style="margin: 20px">
      <div class="wrapper">
        <div class="echart">{{ t('电流') }}</div>
        <EdomsCharts class="charts" :option="currentCurveConfig(item.ia, item.ib, item.ic)"></EdomsCharts>
      </div>
    </div>
    <div style="margin: 20px">
      <div class="wrapper">
        <div class="echart" style="width: 485px">{{ t('负载率') }}</div>
        <EdomsCharts class="charts" :option="loadCurveConfig(item.loadRate, item.imbalanceRate)"></EdomsCharts>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import useApp from '../../../useApp';
import useI18n from '../../../useI18n';
import { ElectricEnergyQuality } from '../type';

const props = defineProps<{
  config: ElectricEnergyQuality;
}>();

useApp(props);

const { t } = useI18n();

const proportionDistributionConfig = (data: any): ECOption => ({
  legend: {
    top: '5%',
    left: 'center',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      color: '#fff',
    },
  },
  color: props.config.proportion.map(({ color }) => color),
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '65%'],
      top: 40,
      label: {
        show: true,
        position: 'outside',
        formatter: '{d}%',
        color: '#fff',
      },
      labelLine: {
        show: true,
        length: 5,
        length2: 5,
      },
      data: [
        { value: data[0], name: '<15%' },
        { value: data[1], name: '15%-30%' },
        { value: data[2], name: '30%-50%' },
        { value: data[3], name: '>50%' },
      ],
    },
  ],
});

const currentCurveConfig = (ia: any, ib: any, ic: any): ECOption => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11,34,52,0.9)',
    borderColor: '#204C6F',
    borderWidth: 1,
    formatter: (params: any) => {
      let tip: string = '';
      if (params != null && params.length > 0) {
        tip +=
          '<div style="min-width:105px;height:90px"><span style="margin-left:8px;color:#C4E5F8;font-size:12px;font-weight: 400;line-height:18px">' +
          t('三相电流') +
          '</span><br />';
        for (let index = 0; index < params.length; index++) {
          tip +=
            '<span style="margin-left:8px;color:#C4E5F8;font-size:12px;font-weight: 400;line-height:18px">' +
            params[index].seriesName +
            ':</span><span style="line-height:18px;margin-left:8px;color:' +
            params[index].color +
            '">' +
            params[index].value +
            'A</span> <br />';
        }
        tip += '</div>';
      }
      return tip;
    },
  },
  legend: {
    data: ['Ia', 'Ib', 'Ic'],
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
    data: ['1', '2', '3', '4', '5', '6', '7', '8'],
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    name: 'A',
    nameTextStyle: {
      align: 'right',
      padding: 7,
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1A242B',
        width: 1,
      },
    },
  },
  grid: { top: '35px', left: '30px', right: '30px', bottom: '44px' },
  color: [props.config.currentLa, props.config.currentLb, props.config.currentLc],
  series: [
    {
      name: 'Ia',
      data: ia,
      type: 'line',
      smooth: true,
      symbolSize: 0,
    },
    {
      name: 'Ib',
      data: ib,
      type: 'line',
      smooth: true,
      symbolSize: 0,
    },
    {
      name: 'Ic',
      data: ic,
      type: 'line',
      smooth: true,
      symbolSize: 0,
    },
  ],
});

const loadCurveConfig = (loadRate: any, imbalanceRate: any): ECOption => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11,34,52,0.9)',
    borderColor: '#204C6F',
    borderWidth: 1,
    padding: 15,
    formatter: (params: any) => {
      let tip: string = '';
      if (params != null && params.length > 0) {
        tip +=
          '<div style="min-width: 130px;height: 45px"><span style="margin-left:8px;color:#C4E5F8;font-size:12px;font-weight: 400;line-height:18px">' +
          t('负载率') +
          '</span><br />';
        for (let index = 0; index < params.length; index++) {
          tip +=
            '<p style="width:100%"><span style="color:#F5F7FA;font-size:12px;font-weight:400">' +
            params[index].seriesName +
            ':</span><span style="margin-left:8px;color:' +
            params[index].color +
            ';font-size:12px;font-weight:400">' +
            params[index].value +
            '%</span></p>';
        }
        tip += '</div>';
      }
      return tip;
    },
  },
  legend: {
    data: [t('负载率'), t('三相不平衡率')],
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
    data: ['1', '2', '3', '4', '5', '6', '7', '8'],
    axisTick: {
      show: false,
    },
  },
  yAxis: [
    {
      type: 'value',
      name: '%',
      nameTextStyle: {
        align: 'right',
        padding: 7,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#1A242B',
          width: 1,
        },
      },
    },
    {
      type: 'category',
      name: '%',
      nameTextStyle: {
        align: 'left',
        padding: 7,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      data: ['0', '20', '40', '60', '80', '100'],
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#1A242B',
          width: 1,
        },
      },
    },
  ],
  grid: { top: '35px', left: '35px', right: '35px', bottom: '44px' },
  color: [props.config.loadRate, props.config.threePhasRate],
  series: [
    {
      name: t('负载率'),
      data: loadRate,
      type: 'line',
      smooth: true,
      symbolSize: 0,
    },
    {
      name: t('三相不平衡率'),
      data: imbalanceRate,
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
  ],
});

const data = ref([
  {
    label: `4#${t('变压器')}`,
    voltage: 20,
    monthTime: 693,
    monthDay: 28,
    maxRate: 9.52,
    workRatio: [60.17, 19.56, 15.42, 0.85],
    ia: [],
    ib: [],
    ic: [],
    loadRate: [],
    imbalanceRate: [],
  },
  {
    label: `5#${t('变压器')}`,
    voltage: 20,
    monthTime: 0,
    monthDay: 0,
    maxRate: 0,
    workRatio: [60.17, 19.56, 15.42, 0.85],
    ia: [],
    ib: [],
    ic: [],
    loadRate: [],
    imbalanceRate: [],
  },
]);
</script>

<style lang="scss" scoped>
.dataEchart {
  display: grid;
  grid-template-columns: 344px 340px 527px 527px;
  grid-template-rows: 316px;
  margin: 30px;
  border: 1px solid #212c3c;
  background: rgba(9, 15, 23, 0.3);

  .dataEchart_frist {
    margin: 20px 0px;
    border-right: 1px solid #1d2634;
    display: grid;
    grid-template-columns: 50% 50%;

    .df_left {
      margin: auto;

      .position_data {
        color: #fff;
        font-size: 14px;
        text-align: center;
      }

      .value_data_con {
        width: 100%;
        height: 100%;

        .value_data {
          color: #fff;
          font-size: 14px;
          text-align: center;
          width: 80px;
          height: 36px;
          background: #030e16;
          border-radius: 2px;
          margin-top: 13px;
          line-height: 36px;
          transform: translateX(-50%);
          margin-left: 50%;

          span {
            color: #00fff0;
            font-size: 20px;
          }
        }
      }
    }

    .text_clm {
      display: grid;
      grid-template-rows: 1fr 1fr 1fr;
      gap: 13px;

      .text_row {
        width: 130px;
        height: 100%;
        margin: auto;
        background: #03121c;
        border: 1px solid #022438;
        border-radius: 0 4px 0 4px;
        text-align: center;
        display: grid;
        align-items: center;

        div {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #eaf5ff;
        }
      }
    }
  }

  .dataEchart_second {
    margin: 20px 0px;
    border-right: 1px solid #1d2634;
  }
}

.echart {
  margin-left: 22px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #eaf5ff;
}

.charts {
  height: 276px;
}
</style>
