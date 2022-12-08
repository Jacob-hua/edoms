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
import { computed, inject, Ref, watch } from 'vue';

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
  red: seriousAlarm as Ref<AlarmList>,
  // 重要
  orange: importantAlarm as Ref<AlarmList>,
  // 一般
  blue: commonAlarm as Ref<AlarmList>,
};
watch(
  () => textColor,
  (color) => {
    console.log(color, 66666);
  },
  {
    immediate: true,
  }
);
const dataSource = computed(() => alarmMap[textColor.value]?.value?.list);
</script>

<style lang="scss" scoped>
.warning-list-wrapper {
  max-height: 800px;
}
</style>
