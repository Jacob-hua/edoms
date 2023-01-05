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

export interface DisabledType {
  clickEvent?: boolean;
  hoverEvent?: boolean;
  allEvent?: boolean;
}

const props = withDefaults(
  defineProps<{
    value: string | number;
    label?: string;
    disabled?: DisabledType;
  }>(),
  {
    label: '',
  }
);

const popMenu = inject<PopMenuProvide>('popMenu', {});
const popMenuOptGroup = inject<PopMenuOptGroupProvide>('popMenuOptGroup', {});

const handleClick = () => {
  if (props.disabled?.clickEvent) {
    return;
  }
  if (popMenuOptGroup?.disabled?.clickEvent) {
    return;
  }
  if (popMenu && typeof popMenu.handleClick === 'function') {
    popMenu.handleClick(props.value);
  }
};

const handleHover = () => {
  if (props.disabled?.hoverEvent) {
    return;
  }
  if (popMenuOptGroup?.disabled?.hoverEvent) {
    return;
  }
  if (popMenu && typeof popMenu.handleHover === 'function') {
    popMenu.handleHover(props.value);
  }
};

const classNames = computed(() =>
  props.disabled?.allEvent || popMenuOptGroup?.disabled?.allEvent
    ? ['pop-menu-option', 'pop-menu-option-disabled']
    : ['pop-menu-option']
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
