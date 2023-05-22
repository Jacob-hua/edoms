<template>
  <div v-for="item in categories" :key="item.name" class="dataEchart">
    <el-row class="row-bg">
      <el-col :span="10">
        <div class="grid-content ep-bg-purple row-bg-left" />
        <p style="color: #fff; font-size: 14px; text-align: center">{{ item.position.label }}</p>
        <p style="color: #fff; font-size: 14px; text-align: center">
          <span style="color: #00fff0; font-size: 20px">{{ item.position.value }}</span
          >kv
        </p>
      </el-col>
      <el-col :span="8">
        <div class="grid-content ep-bg-purple-light" />
        <div class="row-right">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.position.time }}</span
            >小时
          </div>
          <div>当月累计时长</div>
        </div>
        <div class="row-right" style="margin: 20px 0px 20px 20px">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.position.day }}</span
            >天
          </div>
          <div>当月天数</div>
        </div>
        <div class="row-right">
          <div>
            <span style="color: #41e4de; font-size: 24px">{{ item.position.max_rate }}</span
            >%
          </div>
          <div>最大不平衡率</div>
        </div>
      </el-col>
    </el-row>
    <ProportionChart class="echart" style="width: 300px; border-right: 1px solid #212c3c" :option="option_prop">
    </ProportionChart>
    <CurrentChart class="echart" :option="option_current"></CurrentChart>
    <LoadChart class="echart" :option="option_load"></LoadChart>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

// import useIntervalAsync from '../../../useIntervalAsync';
import { ECOption } from '../../..//types';
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
        data: ['La', 'Lb', 'Lc'],
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
        nameGap: 15,
        offset: 15,
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
      color: [props.config.currentLa, props.config.currentLb, props.config.currentLc],
      series: [
        {
          name: 'La',
          data: [1, 4, 1, 5, 1, 4, 1, 5],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'Lb',
          data: [1, 2, 3, 2, 1, 4, 1, 5],
          type: 'line',
          smooth: true,
          symbolSize: 0,
        },
        {
          name: 'Lc',
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
          nameGap: 15,
          offset: 15,
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
          nameGap: 15,
          offset: 15,
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
// useIntervalAsync(updateEfficiencyData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.dataEchart {
  height: 316px;
  border: 1px solid #212c3c;
  background: rgba(9, 15, 23, 0.3);
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
      text-align: center;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #eaf5ff;
      background: #03121c;
      border: 1px solid #02263b;
      border-radius: 0px 4px 0px 4px;
      margin-left: 20px;

      div {
        margin-top: 13px;
      }
    }
  }

  .echart {
    float: left;
    height: 280px;
    margin: 20px 20px 20px 0px;
    color: #eaf5ff;
  }
}
</style>
