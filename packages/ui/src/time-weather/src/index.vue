<template>
  <div class="time-weather">
    <el-row :gutter="20" class="center-text">
      <el-col :span="18">
        <el-row :gutter="30">
          <el-col :span="8">{{ currentDate.realTime }}</el-col>
          <el-col :span="10">{{ currentDate.realDate }}</el-col>
          <el-col :span="6">{{ currentDate.realWeek }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row :gutter="10" class="center-text">
          <el-col :span="14" class="condition-text">{{ weather.condition }}</el-col>
          <el-col :span="10" class="condition-img">
            <div ref="svgRef"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import { weatherSvg } from './assets/svg';
import apiFactory from './api';
import { CurrentDate, GetWeatherRes, TimeWeatherConfig } from './type';

const props = defineProps<{
  config: TimeWeatherConfig;
}>();

const { request } = useApp(props);

const { getWeather } = apiFactory(request);

const weather = ref<GetWeatherRes>({
  time: '-',
  condition: '-',
  temp: '-',
  windLevel: '-',
});

const currentDate = ref<CurrentDate>({
  realDate: '-年-月-日',
  realTime: '--:--:--',
  realWeek: '星期-',
});

const svgRef = ref();

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 1000;
  }
  return props.config.intervalDelay;
});

const complement = function (value: any) {
  return value < 10 ? `0${value}` : value;
};

const formateDate = (date: any) => {
  const time = new Date(date);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const hour = complement(time.getHours());
  const minute = complement(time.getMinutes());
  const second = complement(time.getSeconds());
  const week = '星期' + '日一二三四五六'.charAt(time.getDay());
  currentDate.value = {
    realDate: `${year}年${month}月${day}日`,
    realTime: `${hour}:${minute}:${second}`,
    realWeek: `${week}`,
  };
};

const getLocalWeather = async () => {
  try {
    const result = await getWeather();
    weather.value = result;
  } catch (e: any) {
    console.log(e);
  }
};

watch(
  () => weather.value,
  ({ condition }) => {
    const svghtml = weatherSvg[`weather_${condition}` as keyof typeof weatherSvg];
    console.log(svghtml, 'sss');
    nextTick(() => {
      svgRef.value.innerHTML = svghtml;
    });
  },
  {
    deep: true,
    immediate: true,
  }
);

useIntervalAsync(getLocalWeather, intervalDelay.value);

onMounted(() => {
  setInterval(() => {
    formateDate(new Date());
  }, 1000);
});
</script>

<style lang="scss" scoped>
$iconColor: inherit;

.time-weather {
  min-width: 392px;

  .center-text {
    display: flex;
    align-items: center;
  }

  .condition-text {
    text-align: right;
  }

  .condition-img {
    overflow: hidden;

    :deep(.icon) {
      width: 32px;
      height: 32px;
      vertical-align: -4px;
      overflow: hidden;

      path {
        fill: currentColor;
      }
    }
  }
}
</style>
