<template>
  <BusinessCard :config="config" :title="config.title" :subtitle="config.subTitle" min-width="480" min-height="366">
    <div class="warning-wrapper">
      <div class="warning-list-header">
        <div
          v-for="({ name, className }, index) in headerData"
          :key="index"
          class="list-item"
          @click="handleChangeWarningType(className)"
        >
          <div class="item" :class="calculateClassName(className)">
            {{ name }}
          </div>
        </div>
      </div>
      <!-- warningItem 组件 -->
      <div class="warning-list-wrapper">
        <warning-list></warning-list>
      </div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { provide, Ref, ref, watch } from 'vue';

import { stringToTimestamp, timeSubtract } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import WarningList from './components/WarningList.vue';
import warningApi from './api';
import { Alarm, AlarmList, ClassName, InitAlarmRes } from './type';

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

interface HeaderData {
  name: string;
  className: ClassName;
}

const props = withDefaults(
  defineProps<{
    config: MConfig;
  }>(),
  {
    config: () => ({
      title: '告警管理',
      subTitle: 'Abnormal alarm',
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
    className: 'green',
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
  commonAlarm.value = result?.commonAlarm;
  importantAlarm.value = result?.importantAlarm;
  seriousAlarm.value = result?.seriousAlarm;
  recordFailure({
    commonAlarm: commonAlarm.value,
    importantAlarm: importantAlarm.value,
    seriousAlarm: seriousAlarm.value,
  });
};

const updateAlarmList = async () => {
  const result = await fetchNewAlarmList({
    sysInsCode: props?.config?.instance?.at(-1) as unknown as string,
    isVirtual: props.config.isVirtual ?? '1',
  });
  calculateIncrement(result);
  recordFailure({
    commonAlarm: commonAlarm.value,
    importantAlarm: importantAlarm.value,
    seriousAlarm: seriousAlarm.value,
  });
};

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

const calculateClassName = (className: string) => (activeClassName.value === className ? 'active' : '');

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

provide<Ref<ClassName>>('textColor', activeClassName);
provide<Ref<MConfig>>('config', config);
provide('commonAlarm', commonAlarm);
provide('importantAlarm', importantAlarm);
provide('seriousAlarm', seriousAlarm);
provide('confirmedAlarmList', confirmedAlarmList);
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
  max-height: 86%;
}
</style>
