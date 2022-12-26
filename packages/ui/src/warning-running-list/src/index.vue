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
          <div v-if="!confirmed" :class="['circle', className]"></div>
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
import { computed, provide, Ref, ref, watch } from 'vue';

import { stringToTimestamp, timeSubtract } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import WarningList from './component/WarningList.vue';
import warningApi, { Alarm, AlarmList, InitAlarmRes } from './api';
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
  isVirtual: string;
}
const props = withDefaults(
  defineProps<{
    config: MConfig;
  }>(),
  {
    config: () => ({
      speed: 12,
      isScroll: true,
      intervalDelay: 5000,
      instance: [],
      timeSpan: 1,
      isVirtual: '0',
    }),
  }
);
const config = ref({
  speed: 12,
  isScroll: true,
}) as Ref<MConfig>;

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
const confirmed = computed(() => {
  const alarm = alarmMap[activeClassName.value] as Ref<AlarmList>;
  return alarm.value?.confirmed;
});
const headerData: HeaderData[] = [
  {
    name: '严重告警',
    className: 'red',
  },
  {
    name: '重要警告',
    className: 'orange',
  },
  {
    name: '一般警告',
    className: 'blue',
  },
];
const { request } = useApp(props);
const { fetchInitAlarmList, fetchNewAlarmList, confirmedAlarmList } = warningApi(request);
const activeClassName = ref<ClassName>('red');
const commonAlarm = ref();
const importantAlarm = ref();
const seriousAlarm = ref();

const initAlarmList = async () => {
  const result = await fetchInitAlarmList({
    sysInsCode: props.config.instance?.at(-1) as unknown as string,
    timeSpan: props.config.timeSpan,
    isVirtual: props.config.isVirtual ?? '1',
  });
  commonAlarm.value = result.commonAlarm;
  importantAlarm.value = result.importantAlarm;
  seriousAlarm.value = result.seriousAlarm;
  recordFailure({
    commonAlarm: commonAlarm.value,
    importantAlarm: importantAlarm.value,
    seriousAlarm: seriousAlarm.value,
  });
};

const updateAlarmList = async () => {
  const result = await fetchNewAlarmList({
    sysInsCode: props?.config?.instance?.at(-1) as unknown as string,
  });
  calculateIncrement(result);
  recordFailure({
    commonAlarm: commonAlarm.value,
    importantAlarm: importantAlarm.value,
    seriousAlarm: seriousAlarm.value,
  });
};

watch(
  () => props.config.intervalDelay,
  (intervalDelay) => {
    if (!intervalDelay) {
      return;
    }
    useIntervalAsync(updateAlarmList, intervalDelay);
  },
  { immediate: true }
);

const recordFailure = ({ commonAlarm, importantAlarm, seriousAlarm }: InitAlarmRes) => {
  getFirstClearTime(commonAlarm);
  getFirstClearTime(importantAlarm);
  getFirstClearTime(seriousAlarm);
};
const calculateIncrement = (result: InitAlarmRes) => {
  if (!commonAlarm.value === undefined || commonAlarm?.value?.confirmed === undefined) {
    return;
  }
  commonAlarm.value.confirmed = !!(result.commonAlarm?.confirmed && commonAlarm.value?.confirmed);
  commonAlarm.value.list = [...result.commonAlarm.list, ...commonAlarm.value.list];
  importantAlarm.value.confirmed = !!(result.commonAlarm?.confirmed && commonAlarm.value?.confirmed);
  importantAlarm.value.list = [...result.importantAlarm.list, ...importantAlarm.value.list];
  seriousAlarm.value.confirmed = !!(result.commonAlarm?.confirmed && commonAlarm.value?.confirmed);
  seriousAlarm.value.list = [...result.seriousAlarm.list, ...seriousAlarm.value.list];
  config.value.speed = props.config.speed;
};

initAlarmList();
const alarmMap = {
  // 严重
  red: seriousAlarm as Ref<AlarmList>,
  // 重要
  orange: importantAlarm as Ref<AlarmList>,
  // 一般
  blue: commonAlarm as Ref<AlarmList>,
};

const calculateClassName = (className: string) =>
  activeClassName.value === className ? ['list-item', 'active'] : ['list-item'];

const handleChangeWarningType = (className: ClassName) => {
  activeClassName.value = className;
};
// 获取告警列表中最新最早要失效告警时间
//设置清理
const settingClear = (alarmList: AlarmList, result: Alarm) => {
  setTimeout(() => {
    if (~alarmList?.list?.findIndex(({ id }) => id === result?.id)) {
      alarmList?.list?.splice(
        alarmList?.list?.findIndex(({ id }) => id === result?.id),
        1
      );
    }
  }, timeSubtract(new Date(), props.config.timeSpan, 'hour') - stringToTimestamp(result?.date));
};
const getFirstClearTime = (alarmList: AlarmList) => {
  const result = alarmList?.list?.reduce((timeSpan = alarmList.list[0], alarm: Alarm) => {
    // 找到当前所有项告警信息毫秒值最小的Alarm
    if (stringToTimestamp(alarm.date) < stringToTimestamp(timeSpan.date)) {
      timeSpan = alarm;
    }
    // 找到最早失效的告警信息
    return timeSpan;
  }, {} as Alarm);
  settingClear(alarmList, result);
};

provide<Ref<ClassName>>('textColor', activeClassName);
provide<Ref<MConfig>>('config', config);
provide('commonAlarm', commonAlarm);
provide('importantAlarm', importantAlarm);
provide('seriousAlarm', seriousAlarm);
provide('confirmedAlarmList', confirmedAlarmList);
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
