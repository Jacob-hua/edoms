<template>
  <div class="warning-list">
    <SeamLessScrolling :data-source="dataSource">
      <template #default="{ item }">
        <WarningItem :item="item"></WarningItem>
      </template>
    </SeamLessScrolling>
  </div>
</template>

<script lang="ts" setup>
import { inject, Ref } from 'vue';

import { AlarmList } from '../type';

import SeamLessScrolling from './SeamLessScrolling.vue';
import WarningItem from './WarningItem.vue';
// const textColor = inject<Ref<ClassName>>('textColor') as Ref<ClassName>;
const commonAlarm = inject('commonAlarm');
const importantAlarm = inject('importantAlarm');
const seriousAlarm = inject('seriousAlarm');
const alarmMap = {
  // 严重
  red: seriousAlarm as Ref<AlarmList>,
  // 重要
  orange: importantAlarm as Ref<AlarmList>,
  // 一般
  green: commonAlarm as Ref<[]>,
};

const dataSource = alarmMap.green;
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
