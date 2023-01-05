<template>
  <section>
    <div class="group-header">
      <slot name="groupHeader">
        <span>{{ label }}</span>
      </slot>
    </div>
    <slot></slot>
    <div class="group-footer">
      <slot name="groupFooter"></slot>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { provide } from 'vue';

import type { DisabledType } from './PopMenuOption.vue';

export interface PopMenuOptGroupProvide {
  disabled?: DisabledType;
}

const props = withDefaults(
  defineProps<{
    label?: string;
    disabled?: DisabledType;
  }>(),
  {
    label: () => '',
  }
);

provide<PopMenuOptGroupProvide>('popMenuOptGroup', {
  disabled: props.disabled,
});
</script>

<style lang="scss" scoped>
.group-header {
  color: aqua;
  font-size: 12px;
}

.group-footer {
  color: aqua;
  font-size: 12px;
}
</style>
