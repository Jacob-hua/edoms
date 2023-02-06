<template>
  <div class="time-weather">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-row :gutter="30">
          <el-col :span="8">{{ currentDate.realTime }}</el-col>
          <el-col :span="10">{{ currentDate.realDate }}</el-col>
          <el-col :span="6">{{ currentDate.realWeek }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row :gutter="10">
          <el-col :span="16">{{ weather.condition }}</el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

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

// const weatherIcon = computed(() => {})

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
  // return `${year}年${month}月${day}日 ${week} ${hour}:${minute}:${second}`;
};

const getLocalWeather = async () => {
  try {
    const result = await getWeather();
    weather.value = result;
  } catch (e: any) {
    console.log(e);
  }
};

useIntervalAsync(getLocalWeather, intervalDelay.value);

onMounted(() => {
  setInterval(() => {
    formateDate(new Date());
  }, 1000);
});
</script>

<style lang="scss" scoped></style>
