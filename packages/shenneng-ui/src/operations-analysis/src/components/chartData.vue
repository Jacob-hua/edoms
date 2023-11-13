<template>
  <div class="chart-data-list">
    <div class="left-chart">
      <div class="chart-left-wrapper">
        <div :id="idList[0]" class="chart-ct"></div>
        <span class="chart-num">{{ maxLoadRate + '%' }}</span>
      </div>
      <span class="font-chart">Max</span>
    </div>
    <div class="middle-chart">
      <div class="chart-right-wrapper">
        <div :id="idList[1]" class="chart-ct"></div>
        <span class="chart-num">{{ minLoadRate + '%' }}</span>
      </div>
      <span class="font-chart">Min</span>
    </div>
    <div class="right-list">
      <div v-for="(itm, idx) in loadList" :key="idx" class="list-item">
        <div class="icon-st"></div>
        <div class="name-st">{{ itm.key }}</div>
        <div class="date-st">{{ itm.dis }} h</div>
        <div class="times-st">{{ itm.times }} 次</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import echarts from '../../../echarts';
import useI18n from '../../../useI18n';
import { Iload } from '../type';

const { t } = useI18n();

export interface Ioverload {
  key: string;
  dis: string;
  times: string;
}

const props = defineProps<{
  maxLoadRate: number;
  minLoadRate: number;
  load: Iload;
}>();

const idList = ref<Array<string>>([
  Math.random().toString().substring(3, 30),
  Math.random().toString().substring(3, 30),
]);

const loadList = computed(() => {
  if (!props.load) return;
  const currentLoad = props.load;
  return [
    { key: t('过载'), dis: currentLoad.overloadNum, times: currentLoad.overload },
    { key: t('重载'), dis: currentLoad.heavyLoadNum, times: currentLoad.heavyLoad },
    { key: t('轻载'), dis: currentLoad.lightLoadNum, times: currentLoad.lightLoad },
  ];
});

const initData = (type: string, val: number) => {
  const dom = document.getElementById(type);
  const chart = echarts.init(dom as HTMLDivElement);
  const options = {
    series: [
      {
        hoverAnimation: false,
        type: 'pie',
        radius: ['72%', '90%'],
        data: [
          { value: val, itemStyle: { color: '#00A3FF' } },
          { value: 100 - val, itemStyle: { color: '#1A2E41' } },
        ],
      },
    ],
  };
  chart.setOption(options);
};

onMounted(() => {
  initData(idList.value[0], props.maxLoadRate);
  initData(idList.value[1], props.minLoadRate);
});
</script>

<style lang="scss" scoped>
.chart-data-list {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .left-chart,
  .middle-chart {
    width: 90px;
    height: 118px;
    text-align: center;
    color: rgba(234, 245, 255, 1);
    font-size: 12px;

    .chart-left-wrapper,
    .chart-right-wrapper {
      width: 90px;
      height: 90px;
      text-align: center;
      line-height: 90px;
      margin-bottom: 16px;
      position: relative;

      .chart-ct {
        position: absolute;
        left: 0;
        top: 0;
        width: 90px;
        height: 90px;
      }

      .chart-num {
        color: #ffffff;
        font-size: 15px;
      }
    }
  }

  .right-list {
    width: 45%;
    height: 110px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .list-item {
      width: 100%;
      overflow: hidden;
      display: flex;

      .icon-st {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: rgba(65, 228, 222, 0.2);
        position: relative;

        &::before {
          content: '';
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: rgba(65, 228, 222, 1);
          position: absolute;
          left: 3px;
          top: 3px;
        }
      }

      .name-st {
        width: 30px;
        color: rgba(234, 245, 255, 1);
        font-size: 14px;
        margin-left: 10px;
      }

      .date-st,
      .times-st {
        width: calc((100% - 16px - 30px - 20px) / 2);
        color: rgba(234, 245, 255, 1);
        font-size: 14px;
        text-align: right;
      }
    }
  }
}
</style>
