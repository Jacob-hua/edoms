<template>
  <el-popover
    :placement="placement"
    :trigger="trigger"
    :disabled="disabled"
    @show="handlePopShow"
    @hide="handlePopHide"
  >
    <template #reference>
      <div :class="referenceClass">
        <slot name="reference">
          <span class="el-icon">
            <component :is="reference" />
          </span>
        </slot>
      </div>
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
import { computed, provide } from 'vue';

import { throttle } from '@edoms/utils';

export interface PopMenuProvide {
  handleClick?: (selectedValue: string | number) => void;
}

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    clickDelay?: number;
    reference?: string;
    trigger?: string;
    placement?: string;
  }>(),
  {
    disabled: () => false,
    clickDelay: () => 0,
    reference: () => 'More',
    trigger: () => 'click',
    placement: () => 'bottom',
  }
);

const emit = defineEmits<{
  (event: 'menuClick', selectedValue: string | number): void;
  (event: 'show'): void;
  (event: 'hide'): void;
}>();

const referenceClass = computed(() => (props.disabled ? ['reference', 'reference-disabled'] : ['reference']));

const handleClick = (selectedValue: string | number) => {
  emit('menuClick', selectedValue);
};

const handlePopShow = () => {
  emit('show');
};

const handlePopHide = () => {
  emit('hide');
};

provide<PopMenuProvide>('popMenu', {
  handleClick: throttle(handleClick, props.clickDelay),
});
</script>

<style lang="scss" scoped>
.reference {
  display: inline-block;
  cursor: pointer;
  margin: 1em;
}
.reference-disabled {
  cursor: auto;
  color: black;
}
.el-icon {
  --color: inherit;
  height: 1em;
  width: 1em;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  color: var(--color);
  font-size: inherit;
}
</style>
