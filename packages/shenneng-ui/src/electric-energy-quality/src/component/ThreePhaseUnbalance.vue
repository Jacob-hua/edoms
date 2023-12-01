<template>
  <div v-for="(item, index) in categories" :key="index" class="dataEchart">
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
      <ProportionChart :option="item.circleChart"> </ProportionChart>
    </div>
    <div style="margin: 20px">
      <CurrentChart :option="item.lineChart1"></CurrentChart>
    </div>
    <div style="margin: 20px">
      <LoadChart :option="item.lineChart2"></LoadChart>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatDate } from '@edoms/utils';

import useApp from '../../../useApp';
import useI18n from '../../../useI18n';
import useIntervalAsync from '../../../useIntervalAsync';
import apiFactory from '../api';
import { ElectricEnergyQuality } from '../type';

const props = defineProps<{
  config: ElectricEnergyQuality;
}>();

const { t } = useI18n();

const { request } = useApp(props);
const { fetchRunningData, fetchStData } = apiFactory(request);

const intervalDelay = computed<number>(() =>
  typeof props.config.intervalDelay !== 'number' ? 10 : props.config.intervalDelay
);

// const byq4_current = {
//   Ia: [291.2841, 279.9651, 248.0136, 277.4367, 249.8106, 248.2334, 249.5328, 307.9369],
//   Ib: [292.6177, 280.9302, 247.5605, 276.8418, 250.9959, 247.2667, 249.6436, 308.0461],
//   Ic: [292.6016, 282.2231, 248.5004, 277.256, 251.6891, 247.5361, 250.0867, 306.9834],
// };
// const { request } = useApp(props);
// 占比分布
// const option_prop = ref<ECOption>({});
// 电流
// const option_current4 = ref<ECOption>({});
// const option_current5 = ref<ECOption>({});
// 负载率
// const option_load4 = ref<ECOption>({});
// const option_load5 = ref<ECOption>({});
// 获取饼图颜色
const getpropColor = (series: any[] = []) => {
  return series.map(({ color }) => color);
};
// 获取图例名称
// const getpropName = (series: any[] = []) => {
//   return series.map(({ label }) => label);
// };

const _fetchThreePhaseData = async () => {
  const list = await fetchRunningData({}).catch((err: any) => {
    console.log(err);
  });
  if (!list || !list.length) return;
  // const params = list.filter((itm: any) => itm.name === '设备实控接口')[0];
  const params = {
    apiCode: list.filter((itm: any) => itm.name === '三相不平衡接口')[0]?.code,
    requestParam: {
      devCodes: props.config.threeRhasList.map((item: any) => item?.instance[2]),
      devNames: props.config.threeRhasList.map((item: any) => item?.instanceName),
      time: formatDate(new Date(), 'YYYY-MM-DD'),
      page: '1',
      size: '1000',
    },
  };
  const result = await fetchStData(params).catch((err: any) => {
    console.log(err);
  });
  categories.value = [];
  if (result?.dataList.length) {
    const propColor = getpropColor(props.config.proportion);
    result.dataList.forEach((itm: any) => {
      categories.value.push({
        label1: t('占比分布'),
        label2: t('电流'),
        label3: t('负载率'),
        position: {
          label: itm.deviceInsName,
          value: 20,
          time: itm.hour,
          day: itm.day,
          max_rate: `${itm.maxRate * 100}`,
        },
        circleChart: {
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
              data: Object.keys(itm.pie).map((p: any) => ({ name: p, value: itm.pie[p] })),
            },
          ],
        },
        lineChart1: {
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
            data: itm.chartData.xaxisData,
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
              data: itm.chartData.data[Object.keys(itm.chartData.data)[0]],
              type: 'line',
              smooth: true,
              symbolSize: 0,
            },
            {
              name: 'Ib',
              data: itm.chartData.data[Object.keys(itm.chartData.data)[1]],
              type: 'line',
              smooth: true,
              symbolSize: 0,
            },
            {
              name: 'Ic',
              data: itm.chartData.data[Object.keys(itm.chartData.data)[2]],
              type: 'line',
              smooth: true,
              symbolSize: 0,
            },
          ],
        },
        lineChart2: {
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(11,34,52,0.9)',
            borderColor: '#204C6F',
            borderWidth: 1,
            padding: 15,
            formatter: (params: any) => {
              let tip: string = '';
              if (params != null && params.length > 0) {
                tip += '<div style="min-width: 130px;height: 45px">';
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
            data: itm.chartData.xaxisData,
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
              data: itm.chartData.data[Object.keys(itm.chartData.data)[3]],
              type: 'line',
              smooth: true,
              symbolSize: 0,
            },
            {
              name: t('三相不平衡率'),
              data: itm.chartData.data[Object.keys(itm.chartData.data)[4]],
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
        },
        name: 'five',
      });
    });
  }
};
//数据配置不详 后续在此数据解析
watch(
  () => props.config.proportion,
  () => {
    _fetchThreePhaseData();
  },
  {
    immediate: true,
  }
);

const categories = ref();
useIntervalAsync(_fetchThreePhaseData, intervalDelay.value);
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
