<template>
  <el-popover
    v-model:visible="popoverVisible"
    popper-class="popper"
    :placement="placement"
    :width="width"
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
import { computed, provide, ref } from 'vue';

import { throttle } from '@edoms/utils';

export interface PopMenuProvide {
  handleClick?: (value: string | number) => void;
  handleHover?: (value: string | number) => void;
}

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    clickDelay?: number;
    hoverDelay?: number;
    reference?: string;
    trigger?: string;
    placement?: string;
    width?: string | number;
  }>(),
  {
    disabled: () => false,
    clickDelay: () => 0,
    hoverDelay: () => 0,
    reference: () => 'More',
    trigger: () => 'click',
    placement: () => 'bottom',
    popperClass: () => '',
    width: () => 150,
  }
);

const emit = defineEmits<{
  (event: 'menuClick', value: string | number): void;
  (event: 'menuHover', value: string | number): void;
  (event: 'show'): void;
  (event: 'hide'): void;
}>();

const popoverVisible = ref<boolean>(false);

const referenceClass = computed(() => (props.disabled ? ['reference', 'reference-disabled'] : ['reference']));

const handleClick = (value: string | number) => {
  popoverVisible.value = false;
  emit('menuClick', value);
};

const handleHover = (value: string | number) => {
  emit('menuHover', value);
};

const handlePopShow = () => {
  emit('show');
};

const handlePopHide = () => {
  emit('hide');
};

const handleClose = () => {
  popoverVisible.value = false;
};

provide<PopMenuProvide>('popMenu', {
  handleClick: throttle(handleClick, props.clickDelay),
  handleHover: throttle(handleHover, props.hoverDelay),
});

defineExpose({
  handleClose,
});
</script>

<style lang="scss">
.el-popover.popper {
  padding: 12px 0;
}
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
