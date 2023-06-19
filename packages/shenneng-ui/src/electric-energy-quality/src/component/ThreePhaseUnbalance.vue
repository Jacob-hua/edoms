<template>
  <div v-for="item in categories" :key="item.name" class="dataEchart">
    <div class="dataEchart_frist">
      <div class="df_left">
        <p class="position_data">{{ item.position.label }}</p>
        <div class="value_data_con">
          <p class="value_data">
            <span>{{ item.position.value }}</span
            >kv
          </p>
        </div>
      </div>
      <div class="text_clm">
        <div class="text_row">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.position.time }}</span
            >{{ t('小时') }}
          </div>
          <div>{{ t('当月累计时长') }}</div>
        </div>
        <div class="text_row">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.position.day }}</span
            >{{ t('天') }}
          </div>
          <div>{{ t('当月天数') }}</div>
        </div>
        <div class="text_row">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.position.max_rate }}</span
            >%
          </div>
          <div>{{ t('最大不平衡率') }}</div>
        </div>
      </div>
    </div>
    <div class="dataEchart_second">
      <ProportionChart :option="option_prop"> </ProportionChart>
    </div>
    <div style="margin: 20px">
      <CurrentChart :option="item.name === 'four' ? option_current4 : option_current5"></CurrentChart>
    </div>
    <div style="margin: 20px">
      <LoadChart :option="item.name === 'four' ? option_load4 : option_load5"></LoadChart>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

// import useIntervalAsync from '../../../useIntervalAsync';
import { ECOption } from '../../../types';
import useI18n from '../../../useI18n';
import { ElectricEnergyQuality } from '../type';

import CurrentChart from './CurrentChart.vue';
import LoadChart from './LoadChart.vue';
// import useApp from '../../../useApp';
import ProportionChart from './ProportionChart.vue';
const { t } = useI18n();
const props = defineProps<{
  config: ElectricEnergyQuality;
}>();
// const byq4_current = {
//   Ia: [291.2841, 279.9651, 248.0136, 277.4367, 249.8106, 248.2334, 249.5328, 307.9369],
//   Ib: [292.6177, 280.9302, 247.5605, 276.8418, 250.9959, 247.2667, 249.6436, 308.0461],
//   Ic: [292.6016, 282.2231, 248.5004, 277.256, 251.6891, 247.5361, 250.0867, 306.9834],
// };
// const { request } = useApp(props);
// 占比分布
const option_prop = ref<ECOption>({});
// 电流
const option_current4 = ref<ECOption>({});
const option_current5 = ref<ECOption>({});
// 负载率
const option_load4 = ref<ECOption>({});
const option_load5 = ref<ECOption>({});
// 获取饼图颜色
const getpropColor = (series: any[] = []) => {
  return series.map(({ color }) => color);
};
// 获取图例名称
// const getpropName = (series: any[] = []) => {
//   return series.map(({ label }) => label);
// };

//数据配置不详 后续在此数据解析
watch(
  () => props.config.proportion,
  () => {
    console.log(props.config);
    const propColor = getpropColor(props.config.proportion);
    option_prop.value = {
      legend: {
        // data: propName,
        top: '5%',
        left: 'center',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: '#fff',
        },
      },
      color: propColor,
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
            { value: 60.17, name: '<15%' },
            { value: 19.56, name: '15%-30%' },
            { value: 15.42, name: '30%-50%' },
            { value: 0.85, name: '>50%' },
          ],
        },
      ],
    };
    option_current4.value = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(11,34,52,0.9)',
        borderColor: '#204C6F',
        borderWidth: 1,
        formatter: (params: any) => {
          let tip: string = '';
          if (params != null && params.length > 0) {
            tip +=
              '<div style="width:105px;height:90px"><span style="margin-left:8px;color:#C4E5F8;font-size:12px;font-weight: 400;line-height:18px">三相电流</span><br />';
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
        // nameGap: 15,
        // offset: 15,
        nameTextStyle: {
          align: 'right',
          padding: 7,
        },
        // data: ['2', '4', '6', '8'],
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
          data: [291.2841, 279.9651, 248.0136, 277.4367, 249.8106, 248.2334, 249.5328, 307.9369],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'Ib',
          data: [292.6177, 280.9302, 247.5605, 276.8418, 250.9959, 247.2667, 249.6436, 308.0461],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'Ic',
          data: [292.6016, 282.2231, 248.5004, 277.256, 251.6891, 247.5361, 250.0867, 306.9834],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
      ],
    };
    option_current5.value = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(11,34,52,0.9)',
        borderColor: '#204C6F',
        borderWidth: 1,
        formatter: (params: any) => {
          let tip: string = '';
          if (params != null && params.length > 0) {
            tip +=
              '<div style="width:105px;height:90px"><span style="margin-left:8px;color:#C4E5F8;font-size:12px;font-weight: 400;line-height:18px">三相电流</span><br />';
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
        // nameGap: 15,
        // offset: 15,
        nameTextStyle: {
          align: 'right',
          padding: 7,
        },
        // data: ['2', '4', '6', '8'],
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
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'Ib',
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'Ic',
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
      ],
    };
    option_load4.value = {
      tooltip: {
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
                '<p><span style="color:#F5F7FA;font-size:12px;font-weight:400">' +
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
          // nameGap: 15,
          // offset: 15,
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
          // nameGap: 15,
          // offset: 15,
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
          data: [
            40.12128769, 33.735780675, 42.592085488, 36.602015599, 36.8932692, 35.80097567, 46.652001007, 42.6578128,
          ],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: t('三相不平衡率'),
          data: [15.3978635, 22.1156983, 19.1727799, 19.3278177, 26.1765207, 22.3943031, 13.307268, 12.6976074],
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
    };
    option_load5.value = {
      tooltip: {
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
                '<p><span style="color:#F5F7FA;font-size:12px;font-weight:400">' +
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
          // nameGap: 15,
          // offset: 15,
          nameTextStyle: {
            align: 'right',
            padding: 7,
          },
          // data: ['2', '4', '6', '8'],
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
          // nameGap: 15,
          // offset: 15,
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
      grid: { top: '35px', left: '30px', right: '30px', bottom: '44px' },
      color: [props.config.loadRate, props.config.threePhasRate],
      series: [
        {
          name: '负载率',
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: t('三相不平衡率'),
          data: [0, 0, 0, 0, 0, 0, 0, 0],
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
    };
  },
  {
    immediate: true,
  }
);

const categories = ref([
  {
    label1: t('占比分布'),
    label2: t('电流'),
    label3: t('负载率'),
    position: {
      label: `4#${t('变压器')}`,
      value: 20,
      time: 693,
      day: 28,
      max_rate: 9.52,
    },
    name: 'four',
  },
  {
    label1: t('占比分布'),
    label2: t('电流'),
    label3: t('负载率'),
    position: {
      label: `5#${t('变压器')}`,
      value: 20,
      time: 0,
      day: 0,
      max_rate: 0,
    },
    name: 'five',
  },
]);
// useIntervalAsync(updateEfficiencyData, intervalDelay.value);
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
      grid-template-rows: repeat(3, 33.3%);

      .text_row {
        width: 130px;
        height: 76px;
        margin: auto;
        background: #03121c;
        border: 1px solid #022438;
        border-radius: 0 4px 0 4px;
        text-align: center;

        div {
          margin-top: 13px;
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
</style>
