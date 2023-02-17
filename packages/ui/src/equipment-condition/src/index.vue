<template>
  <div>
    <ElTabs>
      <ElTabPane v-for="(group, index) in groups" :key="index" :label="group" :name="group">
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

const groups = computed<Set<string>>(() => {
  const result = new Set<string>();
  result.add('全部');
  return (
    props.config.groups?.reduce((groups, { group }) => {
      groups.add(group);
      return groups;
    }, result) ?? result
  );
});
</script>
