<template>
  <div class="warning-running-list-container">
    <BusinessCard title="告警列表" subtitle="RUNNING PARAMETERS" min-width="440" min-height="800">
      <div class="warning-list-header">
        <div
          v-for="({ name, className }, index) in headerData"
          :key="index"
          :class="calculateClassName(className)"
          @click="handleChangeWarningType(className)"
        >
          {{ name }}
          <div :class="['circle', className]"></div>
        </div>
      </div>
      <!-- warningItem 组件 -->
      <div class="warning-list-wrapper">
        <warning-list></warning-list>
      </div>
    </BusinessCard>
  </div>
</template>

<script lang="ts" setup>
import { provide, Ref, ref, watch } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';

import WarningList from './component/WarningList.vue';
import warningApi from './api';
import { ClassName } from './type';

interface HeaderData {
  name: string;
  className: string;
}

export interface MConfig {
  speed: number;
  isScroll: boolean;
  intervalDelay: number;
  instance: string[];
  timeSpan: number;
}
const props = withDefaults(
  defineProps<{
    config: MConfig;
  }>(),
  {
    config: () => ({
      speed: 12,
      isScroll: true,
      intervalDelay: 3000,
      instance: [],
      timeSpan: 1,
    }),
  }
);
const { request } = useApp(props);
const { fetchInitAlarmList } = warningApi(request);
const headerData: HeaderData[] = [
  {
    name: '严重告警',
    className: 'red',
  },
  {
    name: '异常警告',
    className: 'orange',
  },
  {
    name: '一般警告',
    className: 'blue',
  },
];

const activeClassName = ref<ClassName>('red');
const config = ref({
  speed: 12,
  isScroll: true,
}) as Ref<MConfig>;
const commonAlarm = ref();
const importantAlarm = ref();
const seriousAlarm = ref();
const initAlarmList = async () => {
  const result = await fetchInitAlarmList({
    sysInsCode: props.config.instance.at(-1) as unknown as string,
    timeSpan: props.config.timeSpan,
  });
  commonAlarm.value = result.commonAlarm;
  importantAlarm.value = result.importantAlarm;
  seriousAlarm.value = result.seriousAlarm;
};
initAlarmList();
watch(
  () => props.config,
  ({ speed, isScroll }) => {
    config.value.speed = speed;
    config.value.isScroll = isScroll;
  },
  {
    immediate: true,
  }
);

const calculateClassName = (className: string) =>
  activeClassName.value === className ? ['list-item', 'active'] : ['list-item'];

const handleChangeWarningType = (className: ClassName) => {
  activeClassName.value = className;
};

provide<Ref<ClassName>>('textColor', activeClassName);
provide<Ref<MConfig>>('config', config);
provide('commonAlarm', commonAlarm);
provide('importantAlarm', importantAlarm);
provide('seriousAlarm', seriousAlarm);
</script>

<style lang="scss" scoped>
@keyframes circle {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  25% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
  }
}
.warning-running-list-container {
  :deep(.business-wrapper-body) {
    display: unset !important;
  }
  .warning-list-header {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .list-item {
      color: #ffffff;
      width: 130px;
      height: 45px;
      line-height: 45px;
      background-color: #ffffff08;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 0 0 0.5px #e1e1e1;
      position: relative;
      .circle {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: absolute;
        top: 5px;
        right: 5px;
        animation: circle 1s linear infinite;
      }
      .red {
        background-color: red;
      }
      .orange {
        background-color: orange;
      }
      .blue {
        background-color: blue;
      }
    }
  }
  .warning-list-wrapper {
    margin-top: 15px;
  }
}
.active {
  color: #ffffff85 !important;
  background-color: transparent !important;
}
</style>
