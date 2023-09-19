<template>
  <div class="warning-list">
    <SeamLessScrolling :data-source="dataSource">
      <template #default="{ item }">
        <WarningItem :item="item" @ignore-warning="handleIgnoreAlarm"></WarningItem>
      </template>
    </SeamLessScrolling>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, Ref } from 'vue';

import { AlarmList, ClassName } from '../type';

import SeamLessScrolling from './SeamLessScrolling.vue';
import WarningItem from './WarningItem.vue';
const textColor = inject<Ref<ClassName>>('textColor') as Ref<ClassName>;
const commonAlarm = inject('commonAlarm');
const importantAlarm = inject('importantAlarm');
const seriousAlarm = inject('seriousAlarm');
const alarmMap = {
  // 严重
  red: seriousAlarm as Ref<AlarmList>,
  // 重要
  orange: importantAlarm as Ref<AlarmList>,
  // 一般
  green: commonAlarm as Ref<AlarmList>,
};

const dataSource = computed(() => alarmMap[textColor.value]?.value?.list);

const handleIgnoreAlarm = (alarmId: number) => {
  const alarmList = alarmMap[textColor.value]?.value?.list;
  const index = alarmList.findIndex(({ id }) => id === alarmId);
  alarmList.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.warning-list {
  width: 100%;
  overflow: auto;
  --webkit--scrollbar-width: none;
}
.warning-list::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
