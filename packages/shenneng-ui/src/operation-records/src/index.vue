<template>
  <BusinessCard :config="config" :title="config.title" :subtitle="config.subTitle" min-width="308" min-height="366">
    <div class="warning-wrapper">
      <div class="warning-list-wrapper">
        <warning-list></warning-list>
      </div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { provide, Ref, ref, watch } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';

import WarningList from './components/WarningList.vue';
import warningApi from './api';
import { ClassName } from './type';

export interface MConfig {
  title: string;
  subTitle: string;
  speed: number;
  isScroll: boolean;
  intervalDelay: number;
  instance: string[];
  timeSpan: number;
  isVirtual: string;
}
const props = withDefaults(
  defineProps<{
    config: MConfig;
  }>(),
  {
    config: () => ({
      title: '操作记录',
      subTitle: 'Operation records',
      speed: 12,
      isScroll: true,
      intervalDelay: 5000,
      instance: [],
      timeSpan: 1,
      isVirtual: '0',
    }),
  }
);
const activeClassName = ref<ClassName>('red');
const commonAlarm = ref();
const { request } = useApp(props);

const { fetchInitAlarmList } = warningApi(request);

const initAlarmList = async () => {
  const result = await fetchInitAlarmList({
    dataCode: props.config.instance?.at(-1) as unknown as string,
    timeSpan: props.config.timeSpan,
    isVirtual: props.config.isVirtual ?? '1',
  });
  commonAlarm.value = result;
};
initAlarmList();
const config = ref({
  speed: 12,
  isScroll: true,
}) as Ref<MConfig>;

watch(
  () => props.config,
  ({ title, subTitle, speed, isScroll }) => {
    config.value.title = title;
    config.value.subTitle = subTitle;
    config.value.speed = speed;
    config.value.isScroll = isScroll;
  },
  {
    immediate: true,
  }
);
// const getOperationData = async () => {
//   commonAlarm.value = [
//     {
//       date: '02-15 16:31',
//       title: '5#变压器20kV出线柜断路由器',
//       content: '5#变压器20kV出线柜断路由器遥控合闸信号下发',
//     },
//     {
//       date: '02-15 16:31',
//       title: '5#变压器20kV出线柜断路由器',
//       content: '5#变压器20kV出线柜断路由器遥控合闸信号下发',
//     },
//     {
//       date: '02-15 16:31',
//       title: '5#变压器20kV出线柜断路由器',
//       content: '5#变压器20kV出线柜断路由器遥控合闸信号下发',
//     },
//     {
//       date: '02-15 16:31',
//       title: '5#变压器20kV出线柜断路由器',
//       content: '5#变压器20kV出线柜断路由器遥控合闸信号下发',
//     },
//     {
//       date: '02-15 16:31',
//       title: '5#变压器20kV出线柜断路由器',
//       content: '5#变压器20kV出线柜断路由器遥控合闸信号下发',
//     },
//     {
//       date: '02-15 16:31',
//       title: '5#变压器20kV出线柜断路由器',
//       content: '5#变压器20kV出线柜断路由器遥控合闸信号下发',
//     },
//   ];
// };
// getOperationData();
provide<Ref<ClassName>>('textColor', activeClassName);
provide<Ref<MConfig>>('config', config);
provide('commonAlarm', commonAlarm);
</script>

<style lang="scss" scoped>
.warning-wrapper {
  width: 100%;
}

.warning-list-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: space-around;
  height: 34px;
  margin: 10px 12px 0;
  border-top: 1px solid rgba(0, 163, 255, 0.3);
  border-bottom: 1px solid rgba(0, 163, 255, 0.3);

  .list-item {
    height: 22px;
    border-left: 1px solid rgba(0, 163, 255, 0.3);
    margin: 5px 0;

    &:last-child {
      border-right: 1px solid rgba(0, 163, 255, 0.3);
    }

    .item {
      width: 92px;
      height: 22px;
      background-color: rgba(0, 163, 255, 0.1);
      text-align: center;
      line-height: 22px;
      margin: 0 auto;
      cursor: pointer;
      color: rgba(196, 229, 248, 1);
      font-size: 14px;
      box-sizing: border-box;

      &.active {
        color: #fff;
        border: 1px solid rgba(0, 163, 255, 1);
      }
    }
  }
}

.warning-list-wrapper {
  display: flex;
  justify-content: center;
  max-height: 95%;
}
</style>
