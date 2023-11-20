<template>
  <div class="wrapper">
    <div class="wrapper_left">
      <div class="wrapper_left_last">
        <CalculationSheet :option="lastMouth"></CalculationSheet>
      </div>
      <div style="margin-top: 40px" class="wrapper_left_last">
        <CalculationSheet :option="nextMouth"></CalculationSheet>
      </div>
    </div>
    <div class="wrapper_right">
      <button @click="changeDilog('month')">{{ t('月曲线分析') }}</button>
      <button @click="changeDilog('day')">{{ t('日曲线分析') }}</button>
      <!-- <button @click="changeDilog('data')">{{ t('数据分析') }}</button> -->
      <div class="wrapper_right_qu">
        <div class="histogram">
          <EdomsCharts class="charts" :option="option_chart"></EdomsCharts>
        </div>
        <!-- <div class="table">
          <p class="table_tie">{{ t('无功优化补偿装置') }}</p>
          <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="{ background: '#0D1218', color: '#EAF5FF', textAlign: 'center', border: 'none' }"
          >
            <el-table-column prop="typesOf" :label="t('类型')" width="180" />
            <el-table-column prop="position" :label="t('接入位置')" width="180" />
            <el-table-column prop="state" :label="t('状态')" />
            <el-table-column prop="adjustment" :label="t('调节量')" />
            <el-table-column prop="range" :label="t('调节范围')" />
          </el-table>
        </div> -->
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      width="1480px"
      top="65px"
      style="height: 723px; background: #000; border: 1px solid #013460"
    >
      <template #header>
        <div class="my-header">
          <img style="margin: 0 20px" src="../../assets/power.png" alt="" />
          <span>{{ title }}</span>
        </div>
      </template>
      <div class="dialog_con">
        <div class="dialog_top">
          <div class="time">
            <span>{{ t('配电室') }}</span>
            <TimeCalendar :option="timeType" @change-time="handlerToChangeTime"></TimeCalendar>
          </div>
          <div v-if="nowDialog" class="boxCheck">
            <el-checkbox-group v-model="checkList" @change="selectType">
              <el-checkbox v-for="typeItem in checkTypeList" :key="typeItem" :label="typeItem">{{
                typeItem
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="selectShow" class="boxSelect">
            <el-select v-model="dataValue" :teleported="false" popper-class="select" class="m-2" placeholder="Select">
              <el-option v-for="item in dataOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </div>
        <div class="chartMonth">
          <EdomsCharts class="chartsCon" :option="optionMonth_chart"></EdomsCharts>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { formatDate } from '@edoms/utils';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import useApp from '../../../useApp';
import useI18n from '../../../useI18n';
import useIntervalAsync from '../../../useIntervalAsync';
import apiFactory from '../api';
import { ElectricEnergyQuality } from '../type';

import CalculationSheet from './CalculationSheet.vue';
import TimeCalendar from './TimeCalendar.vue';
const { t } = useI18n();

const props = defineProps<{
  config: ElectricEnergyQuality;
}>();

const { request } = useApp(props);
const { fetchRunningData, fetchStData } = apiFactory(request);

const intervalDelay = computed<number>(() =>
  typeof props.config.intervalDelay !== 'number' ? 10 : props.config.intervalDelay
);

const lastMouth = ref<any>({
  title: t('上月结算'),
});
const nextMouth = ref<any>({
  title: t('本月结算'),
});
const timeType = ref<string>('date');
const dialogVisible = ref<boolean>(false);
const nowDialog = ref<boolean>(false);
const selectShow = ref<boolean>(false);
const checkTypeList = [t('箱线图'), t('差值波动'), t('Max曲线'), t('Min曲线'), t('均值曲线')];
const checkList = ref<any>([t('箱线图'), t('差值波动'), t('Max曲线'), t('Min曲线'), t('均值曲线')]);
const dataOptions = [
  { value: 'load', label: t('功率因数_负载率') },
  { value: 'hour', label: t('功率因数_小时') },
  { value: 'week', label: t('功率因数_周') },
];
const dataValue = ref<string>(dataOptions[0].value);
// dialog名称
const title = ref<string>('');
// 散点图数据
const dataAll = [
  [20, 0.69],
  [32, 0.18],
  [65, 0.54],
  [44, 0.65],
  [35, 0.47],
  [78, 0.35],
  [12, 0.65],
  [55, 0.77],
  [60, 0.33],
  [44, 0.55],
  [25, 0.2],
  [69, 0.2],
  [18, 0.32],
  [54, 0.65],
  [65, 0.44],
  [47, 0.35],
  [35, 0.78],
  [65, 0.12],
  [77, 0.55],
  [33, 0.6],
  [55, 0.44],
  [20, 0.25],
];
const maxArr = ref<any>([]);
const minArr = ref<any>([]);
dataAll.forEach((item) => {
  if (item[1] > props.config.examine) {
    maxArr.value.push(item);
  } else {
    minArr.value.push(item);
  }
});
// 月度功率因数统计
const option_chart = ref<ECOption>({});
option_chart.value = {
  grid: {
    left: 24,
    bottom: 28,
    right: 20,
  },
  xAxis: {
    type: 'category',
    name: t('月'),
    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  color: 'rgba(40,124,232,0.5)',
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
            '<p style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
            params[index].name +
            '</p><p><span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
            params[index].seriesName.split('：')[0] +
            '：</span><span style="color: #287CE7;font-size: 12px;font-weight: 400;">' +
            params[index].seriesName.split('：')[1] +
            '：' +
            params[index].value +
            '</span></p>';
        }
        tip += '</div>';
      }
      return tip;
    },
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
  yAxis: {
    type: 'value',
    name: t('月度功率因数统计'),
    nameTextStyle: {
      lineHeight: 28,
      padding: [0, 0, 0, 100],
      fontSize: '14',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 400,
      color: '#EAF5FF',
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1A242B',
        width: 1,
      },
    },
    axisLabel: {
      show: false,
    },
  },
  series: [
    {
      name: `${t('考核基准')}：0.9`,
      data: [0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1],
      type: 'bar',
      itemStyle: {
        borderWidth: 1,
        borderColor: '#287CE8',
      },
      barWidth: 16,
      barGap: 70,
    },
  ],
};
const optionMonth_chart = ref<ECOption>({});
const monthChartData = ref<any>({
  assesStandard: 0.9,
  avgList: [],
  boxList: [],
  dataList: [],
  maxList: [],
  minList: [],
  xaxis: [],
});
const dayChartData = ref<any>({
  typicalList: [],
  typicalAvg: [],
  todayList: [],
  todayAvg: [],
  xAxis: [],
});
const timeSt = ref<any>(formatDate(new Date(), 'YYYY-MM'));
// dialog弹框
const changeDilog = (val: string) => {
  dialogVisible.value = true;
  if (val === 'month') {
    timeType.value = 'month';
    nowDialog.value = true;
    selectShow.value = false;
    title.value = t('功率因数_月曲线分析');
    checkList.value = [t('箱线图'), t('差值波动'), t('Max曲线'), t('Min曲线'), t('均值曲线')];
    // 月曲线分析图表
    optionMonth_chart.value = {
      xAxis: {
        type: 'category',
        data: monthChartData.value.xaxis,
        axisTick: {
          show: false,
        },
      },
      color: 'rgba(40,124,232,0.5)',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(11,34,52,0.9)',
        borderColor: '#204C6F',
        borderWidth: 1,
        formatter: (params: any) => {
          let tip: string = '';
          if (params != null && params.length > 0) {
            console.log(params);
            tip += '<div>';
            for (let index = 0; index < params.length; index++) {
              if (params[index].seriesName === t('箱线图')) {
                // 勿删  图例待确认？
                /*tip +=
                  '<p style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
                  params[index].seriesName +
                  '：</p><p style="margin-left: 5px;color: #F5F7FA">开盘值：<span style="color:' +
                  params[index].color +
                  '">' +
                  params[index].value[1] +
                  '<span></p><p style="margin-left: 5px;color: #F5F7FA">封盘值：<span style="color:' +
                  params[index].color +
                  '">' +
                  params[index].value[2] +
                  '</span></p><p style="margin-left: 5px;color: #F5F7FA">最大值：<span style="color:' +
                  params[index].color +
                  '">' +
                  params[index].value[4] +
                  '</span></p><p style="margin-left: 5px;color: #F5F7FA">最小值：<span style="color:' +
                  params[index].color +
                  '">' +
                  params[index].value[3] +
                  '</span></p>';*/
              } else {
                tip +=
                  '<p><span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
                  params[index].seriesName +
                  '：</span><span style="color:' +
                  params[index].color +
                  ';font-size: 12px;font-weight: 400;">' +
                  params[index].value +
                  '</span></p>';
              }
            }
            tip += '</div>';
          }
          return tip;
        },
      },
      legend: {
        show: false,
        selected: { 箱线图: true, 差值波动: true, Max曲线: true, Min曲线: true, 均值曲线: true },
      },
      yAxis: {
        type: 'value',
        nameTextStyle: {
          fontSize: '14',
          fontFamily: 'Microsoft YaHei',
          fontWeight: 400,
          color: '#EAF5FF',
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#1A242B',
            width: 1,
          },
        },
      },
      grid: { top: '30px', left: '30px', right: '30px', bottom: '30px' },
      series: [
        {
          name: t('箱线图'),
          type: 'candlestick',
          color: 'rgba(40,124,232,0.3)',
          data: monthChartData.value.boxList,
          itemStyle: {
            color: 'rgba(40, 124, 232, 0.3)',
            borderWidth: 1,
            borderColor: '#287CE8',
          },
        },
        {
          name: t('差值波动'),
          type: 'bar',
          data: monthChartData.value.diffList.map((itm: any) => itm[1]),
          itemStyle: {
            color: 'rgba(40, 124, 232, 0.3)',
            borderWidth: 1,
            borderColor: '#287CE8',
          },
          barWidth: 16,
          barGap: 35,
        },
        {
          name: t('Max曲线'),
          type: 'line',
          color: '#207C44',
          data: monthChartData.value.maxList.map((itm: any) => itm[1]),
          smooth: true,
          symbolSize: 0,
          markLine: {
            lineStyle: {
              color: '#0E9CFF',
              width: 1,
              type: 'dashed',
            },
            label: {
              show: false,
            },
            data: [
              {
                name: t('考核基准'),
                yAxis: props.config.examine,
              },
            ],
            silent: true,
            symbol: 'none',
          },
        },
        {
          name: t('Min曲线'),
          type: 'line',
          color: '#30A9A5',
          data: monthChartData.value.minList.map((itm: any) => itm[1]),
          smooth: true,
          symbolSize: 0,
        },
        {
          name: t('均值曲线'),
          type: 'line',
          data: monthChartData.value.avgList.map((itm: any) => itm[1]),
          smooth: true,
          symbolSize: 0,
        },
      ],
    };
  } else if (val === 'day') {
    timeType.value = 'date';
    nowDialog.value = false;
    selectShow.value = false;
    title.value = t('功率因数_日曲线分析');
    // 日曲线分析
    optionMonth_chart.value = {
      xAxis: {
        type: 'category',
        data: dayChartData.value.xAxis,
        axisTick: {
          show: false,
        },
      },
      color: 'rgba(40,124,232,0.5)',
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
                '<p><span style="color: #F5F7FA">' +
                params[index].seriesName +
                '：</span><span style="color:' +
                params[index].color +
                '">' +
                params[index].value +
                '%</span></p>';
            }
            tip += '</div>';
          }
          return tip;
        },
      },
      yAxis: {
        type: 'value',
        nameTextStyle: {
          fontSize: '14',
          fontFamily: 'Microsoft YaHei',
          fontWeight: 400,
          color: '#EAF5FF',
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#1A242B',
            width: 1,
          },
        },
      },
      grid: { top: '30px', left: '30px', right: '30px', bottom: '30px' },
      series: [
        {
          name: t('日数据'),
          type: 'line',
          color: '#40E0DA',
          data: dayChartData.value.todayList,
          smooth: true,
          symbolSize: 0,
          markLine: {
            lineStyle: {
              color: '#0E9CFF',
              width: 1,
              type: 'dashed',
            },
            label: {
              show: false,
            },
            data: [
              {
                name: t('日均值'),
                yAxis: dayChartData.value.todayAvg,
              },
            ],
            silent: true,
            symbol: 'none',
          },
        },
        {
          name: t('	典型日数据'),
          type: 'line',
          color: '#246ECE',
          data: dayChartData.value.typicalList,
          smooth: true,
          symbolSize: 0,
          markLine: {
            lineStyle: {
              color: '#246ECE',
              width: 1,
              type: 'dashed',
            },
            label: {
              show: false,
            },
            data: [
              {
                name: t('典型日均值'),
                yAxis: dayChartData.value.typicalAvg,
              },
            ],
            silent: true,
            symbol: 'none',
          },
        },
      ],
    };
  } else {
    timeType.value = 'date';
    nowDialog.value = false;
    selectShow.value = true;
    title.value = t('功率因数_数据分析');
    // 数据分析
    optionMonth_chart.value = {
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%',
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(11,34,52,0.9)',
        borderColor: '#204C6F',
        borderWidth: 1,
        formatter: (params: any) => {
          let tip: string = '';
          if (params != null && params.length > 0) {
            tip += '<div><p style="color: #F5F7FA">' + t('功率因数') + '：</p>';
            for (let index = 0; index < params.length; index++) {
              tip +=
                '<p>' +
                params[index].marker +
                '<span style="color:' +
                params[index].color +
                '">' +
                params[index].value[1] +
                '</span></p>';
            }
            tip += '</div>';
          }
          return tip;
        },
      },
      yAxis: {
        type: 'value',
        nameTextStyle: {
          fontSize: '14',
          fontFamily: 'Microsoft YaHei',
          fontWeight: 400,
          color: '#EAF5FF',
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#1A242B',
            width: 1,
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      grid: { top: '30px', left: '55px', right: '30px', bottom: '51px' },
      color: ['rgba(65,228,222,0.7)', 'rgba(215,40,36,0.7)'],
      series: [
        {
          symbolSize: 20,
          data: maxArr.value,
          type: 'scatter',
          markLine: {
            lineStyle: {
              color: '#0E9CFF',
              width: 1,
              type: 'dashed',
            },
            label: {
              show: false,
            },
            data: [
              {
                name: t('考核基准'),
                yAxis: props.config.examine,
              },
            ],
            silent: true,
            symbol: 'none',
          },
        },
        {
          symbolSize: 20,
          data: minArr.value,
          type: 'scatter',
        },
      ],
    };
  }
};

const handlerToChangeTime = async (time: any) => {
  const list = await fetchRunningData({}).catch((err: any) => {
    console.log(err);
  });
  if (!list || !list.length) return;
  if (timeType.value === 'month') {
    timeSt.value = formatDate(time, 'YYYY-MM');
    // 月曲线分析
    const params3 = {
      apiCode: list.filter((itm: any) => itm.name === '月曲线分析接口')[0]?.code,
      requestParam: {
        devCode: props.config.gonglvyinshu[0]?.instance[2],
        month: timeSt.value,
        interval: '1H',
      },
    };
    const result3 = await fetchStData(params3).catch((err: any) => {
      console.log(err);
    });
    if (result3) {
      monthChartData.value = result3;
      changeDilog('month');
    }
  } else if (timeType.value === 'date') {
    timeSt.value = formatDate(time, 'YYYY-MM-DD');
    const params4 = {
      apiCode: list.filter((itm: any) => itm.name === '日曲线分析接口')[0]?.code,
      requestParam: {
        devCode: props.config.gonglvyinshu[0]?.instance[2],
        time: timeSt.value,
      },
    };
    const result4 = await fetchStData(params4).catch((err: any) => {
      console.log(err);
    });
    if (result4) {
      dayChartData.value = result4;
      changeDilog('day');
    }
  }
};

// 多选框值改变触发
const selectType = () => {
  const checkObj: any = {};
  let checkObj_item: string = '';
  for (let index = 0; index < checkList.value.length; index++) {
    checkObj_item = checkList.value[index];
    checkObj[checkObj_item] = true;
  }
  const selObj: any = {};
  let selObj_item: string = '';
  for (let index = 0; index < checkTypeList.length; index++) {
    selObj_item = checkTypeList[index];
    selObj[selObj_item] = false;
  }
  const showObj = Object.assign(selObj, checkObj);
  optionMonth_chart.value.legend = {
    show: false,
    selected: showObj,
  };
};
// 无功优化补偿
// const tableData = [
//   {
//     typesOf: t('类型一'),
//     position: t('位置一'),
//     state: '44.20',
//     adjustment: '44.20',
//     range: '44.20',
//   },
//   {
//     typesOf: t('类型一'),
//     position: t('位置一'),
//     state: '44.20',
//     adjustment: '44.20',
//     range: '44.20',
//   },
//   {
//     typesOf: t('类型一'),
//     position: t('位置一'),
//     state: '44.20',
//     adjustment: '44.20',
//     range: '44.20',
//   },
//   {
//     typesOf: t('类型一'),
//     position: t('位置一'),
//     state: '44.20',
//     adjustment: '44.20',
//     range: '44.20',
//   },
// ];

const _fetchData = async () => {
  const list = await fetchRunningData({}).catch((err: any) => {
    console.log(err);
  });
  if (!list || !list.length) return;
  // const params = list.filter((itm: any) => itm.name === '设备实控接口')[0];
  // 功率因数
  const params1 = {
    apiCode: list.filter((itm: any) => itm.name === '功率因数')[0]?.code,
    requestParam: {
      devInsCode: props.config.gonglvyinshu[0]?.instance[2],
      month: formatDate(new Date(), 'YYYY-MM'),
    },
  };
  const result1 = await fetchStData(params1).catch((err: any) => {
    console.log(err);
  });
  lastMouth.value = { title: t('上月结算'), ...result1?.lastInfo };
  nextMouth.value = { title: t('本月结算'), ...result1?.currentInfo };

  // 月度功率因数统计
  const params2 = {
    apiCode: list.filter((itm: any) => itm.name === '月度功率因数统计接口')[0]?.code,
    requestParam: {
      devCode: props.config.gonglvyinshu[0]?.instance[2],
      year: formatDate(new Date(), 'YYYY'),
    },
  };
  const result2 = await fetchStData(params2).catch((err: any) => {
    console.log(err);
  });
  option_chart.value.series[0].name = `${t('考核基准')}：${result2?.assesStandard}`;
  option_chart.value.xAxis.data = result2?.xaxis;
  option_chart.value.series[0].data = result2?.dataList?.map((itm: any) => itm[1]);

  // 月曲线分析
  const params3 = {
    apiCode: list.filter((itm: any) => itm.name === '月曲线分析接口')[0]?.code,
    requestParam: {
      devCode: props.config.gonglvyinshu[0]?.instance[2],
      month: timeSt.value,
      interval: '1H',
    },
  };
  const result3 = await fetchStData(params3).catch((err: any) => {
    console.log(err);
  });
  if (result3) {
    monthChartData.value = result3;
  }

  // 日曲线分析接口
  const params4 = {
    apiCode: list.filter((itm: any) => itm.name === '日曲线分析接口')[0]?.code,
    requestParam: {
      devCode: props.config.gonglvyinshu[0]?.instance[2],
      time: formatDate(new Date(), 'YYYY-MM-DD'),
    },
  };
  const result4 = await fetchStData(params4).catch((err: any) => {
    console.log(err);
  });
  if (result4) {
    dayChartData.value = result4;
  }
};

useIntervalAsync(_fetchData, intervalDelay.value);
</script>

<style lang="scss" scoped>
:deep(.el-table tr) {
  height: 46px;
}

:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  border: none;
  text-align: center;
}

:deep(.el-table .el-table__body tr:nth-child(even)) {
  background-color: #0d1218;
  color: #eaf5ff;
}

:deep(.el-table__inner-wrapper::before) {
  content: none;
}

:deep(.el-table .el-table__body tr:nth-child(odd)) {
  background-color: #080b0f;
  color: #eaf5ff;
}

:deep(.alculation_con .el-row .el-col .grid-content) {
  p {
    margin-top: 30px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #eaf5ff;

    span {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #41e4de;
    }
  }
}

:deep(.el-dialog__header) {
  padding: 0;
  width: 1480px;
  height: 52px;
  background-image: url('../../assets/title-bg.png');
  background-size: 100% 100%;
  border-bottom: 1px solid #013460;
}

:deep(.el-input__wrapper) {
  background: #030507;
  box-shadow: none;
  border: 1px solid #454e72;

  .el-input__inner {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }
}

:deep(.el-popper.is-pure) {
  inset: auto !important;
}

:deep(.el-select-dropdown__list) {
  margin: auto !important;
}

:deep(.el-popper__arrow::before) {
  content: none;
}

.wrapper {
  height: 660px;
  margin: 30px 30px;
  display: flex;

  .wrapper_left {
    width: 782px;
    margin-right: 20px;

    .wrapper_left_last {
      height: 310px;
    }

    .wrapper_left_now {
      height: 310px;
      background: rgba(9, 15, 23, 0.3);
      border: 1px solid #212c3c;
    }
  }

  .wrapper_right {
    width: 938px;

    button {
      min-width: 130px;
      height: 36px;
      background: rgba(0, 163, 255, 0.16);
      border: 1px solid #007bc0;
      border-radius: 2px;
      margin-right: 40px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
    }

    .wrapper_right_qu {
      height: 604px;
      margin-top: 20px;
      background: rgba(9, 15, 23, 0.3);
      border: 1px solid #212c3c;

      .histogram {
        height: 302px;
        width: 938px;

        .charts {
          height: 302px;
          width: 938px;
        }
      }

      .table {
        height: 270px;
        padding: 20px;

        .table_tie {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #eaf5ff;
          margin-bottom: 18px;
        }
      }
    }
  }

  .my-header {
    height: 52px;
    line-height: 52px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #eaf5ff;
  }

  .dialog_top {
    height: 60px;
    display: flex;
    justify-content: space-between;

    span {
      margin: 0px 27px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      line-height: 80px;
    }

    .time {
      height: 60px;
      display: flex;
    }

    .boxCheck {
      height: 60px;
      width: 530px;
      padding-top: 30px;
    }

    .boxSelect {
      margin-top: 30px;
      width: 200px;
      height: 32px;
      margin-right: 30px;
      background: #030507;
      box-sizing: border-box;

      .select {
        inset: auto !important;
        background-color: #030507;

        .el-select-dropdown__item {
          border-bottom: 1px solid #454e72;
          background-color: #030507;
          padding: 0 !important;
          text-align: center;
        }
      }
    }
  }

  .dialog_con .chartMonth {
    width: 1420px;
    height: 550px;

    .chartsCon {
      width: 1420px;
      height: 550px;
    }
  }
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: rgba(40, 124, 232);
  border: 1px solid #287ce8;
  border-radius: 4px;
}

:deep(.el-dialog__body) {
  width: 1424px;
  height: 610px;
  border: 1px solid #212c3c;
  background: rgba(9, 15, 23, 0.3);
  padding: 0px;
  margin: 30px;
}
</style>
