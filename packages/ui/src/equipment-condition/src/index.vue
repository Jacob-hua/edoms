<template>
  <div>
    <ElTabs>
      <ElTabPane v-for="(group, index) in equipmentGroups" :key="index" :label="group" :name="group">
        {{ group }}
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { ElTabPane, ElTabs } from '@edoms/design';

import useApp from '../../useApp';

import { MEquipmentCondition } from './type';

const props = defineProps<{
  config: MEquipmentCondition;
}>();

useApp(props);

const equipmentGroups = computed<string[]>(
  () =>
    props.config.conditions?.reduce((equipmentGroups, { label }) => [...equipmentGroups, label], [
      '全部',
    ] as string[]) ?? ['全部']
);
</script>
