<template>
  <el-popover placement="bottom" trigger="click">
    <template #reference>
      <slot name="reference">
        <el-button>菜单</el-button>
      </slot>
    </template>
    <div>
      <div>
        <slot name="header"></slot>
      </div>
      <slot></slot>
      <div>
        <slot name="footer"></slot>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { provide } from 'vue';

import { throttle } from '@edoms/utils';

export interface PopMenuProvide {
  handleClick: (selectedValue: string | number) => void;
}

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    clickDelay?: number;
  }>(),
  {
    disabled: () => false,
    clickDelay: () => 0,
  }
);

const emit = defineEmits<{
  (event: 'change', selectedValue: string | number): void;
}>();

const handleClick = (selectedValue: string | number) => {
  emit('change', selectedValue);
};

provide<PopMenuProvide>('popMenu', {
  handleClick: throttle(handleClick, props.clickDelay),
});
</script>
