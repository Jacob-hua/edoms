<template>
  <div class="warning-list-wrapper">
    <SeamLessScrolling :data-source="dataSource">
      <template #default="{ item }">
        <WarningItem :item="item"></WarningItem>
      </template>
    </SeamLessScrolling>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, Ref } from 'vue';

import { AlarmList } from '../api';
import { ClassName } from '../type';

import SeamLessScrolling from './SeamLessScrolling.vue';
import WarningItem from './WarningItem.vue';
const textColor = inject<Ref<ClassName>>('textColor') as Ref<ClassName>;
const commonAlarm = inject('commonAlarm');
const importantAlarm = inject('importantAlarm');
const seriousAlarm = inject('seriousAlarm');
console.log({ commonAlarm, importantAlarm, seriousAlarm });
const alarmMap = {
  // 严重
  red: seriousAlarm as AlarmList,
  // 重要
  orange: importantAlarm as AlarmList,
  // 一般
  blue: commonAlarm as AlarmList,
};
// console.log(textColor.value);
const data = alarmMap[textColor.value];
// console.log(JSON.parse(JSON.stringify(data)));
console.log(data);
const dataSource = computed(() => alarmMap[textColor.value].list);

console.log(dataSource);
</script>

<style lang="scss" scoped>
.warning-list-wrapper {
}
</style>
