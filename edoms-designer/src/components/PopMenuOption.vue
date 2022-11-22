<template>
  <div :class="classNames" @click.stop="handleClick" @mouseenter="handleHover">
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
    value: string | number;
    label?: string;
    disabled?: boolean;
  }>(),
  {
    label: '',
  }
);

const popMenu = inject<PopMenuProvide>('popMenu', {});
const popMenuOptGroup = inject<PopMenuOptGroupProvide>('popMenuOptGroup', {});

const handleClick = () => {
  if (props.disabled) {
    return;
  }
  if (popMenuOptGroup?.disabled) {
    return;
  }
  if (popMenu && typeof popMenu.handleClick === 'function') {
    popMenu.handleClick(props.value);
  }
};

const handleHover = () => {
  if (props.disabled) {
    return;
  }
  if (popMenuOptGroup?.disabled) {
    return;
  }
  if (popMenu && typeof popMenu.handleHover === 'function') {
    popMenu.handleHover(props.value);
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
  padding: 12px;

  &:hover {
    background-color: rgb(119, 118, 118);
  }
}

.pop-menu-option-disabled {
  cursor: auto;
  color: aliceblue;
  background-color: azure;
  pointer-events: none;
}
</style>
