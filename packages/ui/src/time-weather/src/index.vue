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
          <el-col :span="10"><img :src="weatherIcon" alt="" /></el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import D1 from './assets/d1-晴.svg';
import D2 from './assets/d2-多云.svg';
import D3 from './assets/d3-阴.svg';
import D4 from './assets/d4-阵雨.svg';
import D5 from './assets/d5-雷阵雨.svg';
import D6 from './assets/d6-雷阵雨伴有冰雹.svg';
import D7 from './assets/d7-雨夹雪.svg';
import D8 from './assets/d8-小雨.svg';
import D9 from './assets/d9-中雨.svg';
import D10 from './assets/d10-大雨.svg';
import D11 from './assets/d11-暴雨.svg';
import D12 from './assets/d12-大暴雨.svg';
import D13 from './assets/d13-特大暴雨.svg';
import D14 from './assets/d14-阵雪.svg';
import D15 from './assets/d15-小雪.svg';
import D16 from './assets/d16-中雪.svg';
import D17 from './assets/d17-大雪.svg';
import D18 from './assets/d18-暴雪.svg';
import D19 from './assets/d19-雾.svg';
import D20 from './assets/d20-冻雨.svg';
import D21 from './assets/d21-沙尘暴.svg';
import D22 from './assets/d22-小雨转中雨.svg';
import D23 from './assets/d23-中雨转大雨.svg';
import D24 from './assets/d24-大雨转暴雨.svg';
import D25 from './assets/d25-暴雨转大暴雨.svg';
import D26 from './assets/d26-大暴雨转特大暴雨.svg';
import D27 from './assets/d27-小雪转中雪.svg';
import D28 from './assets/d28-中雪转大雪.svg';
import D29 from './assets/d29-大雪转暴雪.svg';
import D30 from './assets/d30-浮尘.svg';
import D31 from './assets/d31-扬沙.svg';
import D32 from './assets/d32-强沙尘暴.svg';
import D33 from './assets/d33-霾.svg';
import apiFactory from './api';
import { CurrentDate, GetWeatherRes, TimeWeatherConfig } from './type';

const props = defineProps<{
  config: TimeWeatherConfig;
}>();

const iconObj = {
  晴: D1,
  多云: D2,
  阴: D3,
  阵雨: D4,
  雷阵雨: D5,
  雷阵雨伴有冰雹: D6,
  雨夹雪: D7,
  小雨: D8,
  中雨: D9,
  大雨: D10,
  暴雨: D11,
  大暴雨: D12,
  特大暴雨: D13,
  阵雪: D14,
  小雪: D15,
  中雪: D16,
  大雪: D17,
  暴雪: D18,
  雾: D19,
  冻雨: D20,
  沙尘暴: D21,
  小雨转中雨: D22,
  中雨转大雨: D23,
  大雨转暴雨: D24,
  暴雨转大暴雨: D25,
  大暴雨转特大暴雨: D26,
  小雪转中雪: D27,
  中雪转大雪: D28,
  大雪转暴雪: D29,
  浮尘: D30,
  扬沙: D31,
  强沙尘暴: D32,
  霾: D33,
  // '-':D1
};

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

const weatherIcon = computed(() => {
  const condition = weather.value.condition;
  return iconObj[condition as keyof typeof iconObj];
});

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

useIntervalAsync(getLocalWeather, intervalDelay.value);

onMounted(() => {
  setInterval(() => {
    formateDate(new Date());
  }, 1000);
});
</script>

<style lang="scss" scoped>
.time-weather {
  min-width: 392px;

  .center-text {
    display: flex;
    align-items: center;
  }

  .condition-text {
    text-align: right;
  }

  img {
    width: 30px;
  }
}
</style>
