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

export interface PopMenuOptGroupProvide {
  disabled: boolean;
}

const props = withDefaults(
  defineProps<{
    label?: string;
    disabled?: boolean;
  }>(),
  {
    label: () => '',
    disabled: () => false,
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
