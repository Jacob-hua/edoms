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
            >小时
          </div>
          <div>当月累计时长</div>
        </div>
        <div class="text_row">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.position.day }}</span
            >天
          </div>
          <div>当月天数</div>
        </div>
        <div class="text_row">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.position.max_rate }}</span
            >%
          </div>
          <div>最大不平衡率</div>
        </div>
      </div>
    </div>
    <div class="dataEchart_second">
      <ProportionChart :option="option_prop"> </ProportionChart>
    </div>
    <div style="margin: 20px">
      <CurrentChart :option="option_current"></CurrentChart>
    </div>
    <div style="margin: 20px">
      <LoadChart :option="option_load"></LoadChart>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

// import useIntervalAsync from '../../../useIntervalAsync';
import { ECOption } from '../../../types';
import { ElectricEnergyQuality } from '../type';

import CurrentChart from './CurrentChart.vue';
import LoadChart from './LoadChart.vue';
// import useApp from '../../../useApp';
import ProportionChart from './ProportionChart.vue';

const props = defineProps<{
  config: ElectricEnergyQuality;
}>();
console.log(props.config.proportion);
// const { request } = useApp(props);
// 占比分布
const option_prop = ref<ECOption>({});
// 电流
const option_current = ref<ECOption>({});
// 负载率
const option_load = ref<ECOption>({});
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
    option_current.value = {
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
        data: ['2', '4', '6', '8'],
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#1A242B',
            width: 1,
          },
        },
      },
      grid: { top: '35px', left: '20px', right: '20px', bottom: '44px' },
      color: [props.config.currentLa, props.config.currentLb, props.config.currentLc],
      series: [
        {
          name: 'Ia',
          data: [1, 4, 1, 5, 1, 4, 1, 5],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'Ib',
          data: [1, 2, 3, 2, 1, 4, 1, 5],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'Ic',
          data: [2, 6, 2, 6, 2, 6, 2, 6],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
      ],
    };
    option_load.value = {
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
        data: ['负载率', '三相不平衡率'],
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
          name: 'A',
          // nameGap: 15,
          // offset: 15,
          nameTextStyle: {
            align: 'right',
            padding: 7,
          },
          data: ['2', '4', '6', '8'],
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
          data: ['0%', '20%', '40%', '60%', '80%'],
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#1A242B',
              width: 1,
            },
          },
        },
      ],
      grid: { top: '35px', left: '15px', right: '32px', bottom: '44px' },
      color: [props.config.loadRate, props.config.threePhasRate],
      series: [
        {
          name: '负载率',
          data: [1, 4, 1, 5, 1, 4, 1, 5],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: '三相不平衡率',
          data: [1, 2, 3, 2, 1, 4, 1, 5],
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
    label1: '占比分布',
    label2: '电流',
    label3: '负载率',
    position: {
      label: '4#变压器',
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
      label: '5#变压器',
      value: 10,
      time: 377,
      day: 16,
      max_rate: 9.52,
    },
    name: 'systems',
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
