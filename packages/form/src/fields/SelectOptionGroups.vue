<template>
  <ElOptionGroup v-for="(group, index) in options" :key="index" :label="group.label" :disabled="group.disabled">
    <component
      v-for="(item, optionIndex) in group.options"
      :key="optionIndex"
      :is="uiComponent.component"
      :label="item.label || item.text"
      :value="item.value"
      :disabled="item.disabled"
    >
    </component>
  </ElOptionGroup>
</template>

<script lang="ts" setup>
import { ElOptionGroup, getConfig } from '@edoms/design';

import { SelectGroupOption } from '../schema';

defineProps<{
  options: SelectGroupOption[];
}>();

const uiComponent = getConfig('components').option;
</script>
