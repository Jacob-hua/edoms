<template>
  <BusinessCard :config="config" :title="config.title" :subtitle="config.subTitle" min-width="400" min-height="366">
    <div class="warning-wrapper">
      <div class="warning-list-header">
        <div
          v-for="({ name, className }, index) in headerData"
          :key="index"
          :class="[
            'list-item',
            calculateClassName(className),
            activeClassName !== className ? `list-item${index + 1}` : '',
          ]"
          @click="handleChangeWarningType(className)"
        >
          {{ name }}
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
import locales from './locales';
import { Alarm, AlarmList, ClassName, InitAlarmRes, MWarningConfigs } from './type';

interface HeaderData {
  name: string;
  className: ClassName;
}
const props = defineProps<{
  config: MWarningConfigs;
}>();
const config = ref({
  speed: 12,
  isScroll: true,
}) as Ref<MWarningConfigs>;

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

const { request, setMessage, t } = useApp(props);
setMessage(locales);
const headerData: HeaderData[] = [
  {
    name: t('严重警告'),
    className: 'red',
  },
  {
    name: t('异常警告'),
    className: 'orange',
  },
  {
    name: t('一般警告'),
    className: 'green',
  },
];
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
provide<Ref<MWarningConfigs>>('config', config);
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

  .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff73;
    border: 1px solid #4d505f;
    padding: 9px 0;
    margin: 0 1px;
    cursor: pointer;
    position: relative;
  }

  .list-item.active {
    background: #333c50;
    color: #ffffffd9;
  }
}

//右上角浮点
$signColor: #850606, #d5c02c, #2eb0ff;

@mixin warning-sign($color) {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: $color;
}

@each $value in $signColor {
  $i: index($signColor, $value);

  .list-item#{$i}::after {
    @include warning-sign($value);
  }
}

.warning-list-wrapper {
  display: flex;
  justify-content: center;
  max-height: 86%;
}
</style>
