<template>
  <div :class="classNames" @click.stop="handleClick">
    <slot :item="{ label, disabled }">
      <span>{{ label }}</span>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import { PopMenuProvide } from './PopMenu.vue';
import { PopMenuOptGroupProvide } from './PopMenuOptGroup.vue';

const props = withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    disabled?: boolean;
  }>(),
  {}
);

const popMenu = inject<PopMenuProvide>('popMenu');
const popMenuOptGroup = inject<PopMenuOptGroupProvide>('popMenuOptGroup');

const handleClick = () => {
  if (props.disabled) {
    return;
  }
  if (popMenuOptGroup?.disabled) {
    return;
  }
  if (popMenu) {
    popMenu.handleClick(props.value);
  }
};

const classNames = computed(() =>
  props.disabled || popMenuOptGroup?.disabled ? ['pop-menu-option', 'pop-menu-option-disabled'] : ['pop-menu-option']
);
</script>

<style lang="scss" scoped>
.pop-menu-option {
  cursor: pointer;
  border-bottom: 1px solid #333;
  padding: 10px 0;
}

.pop-menu-option-disabled {
  color: aliceblue;
  background-color: azure;
}
</style>
