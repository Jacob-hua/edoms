<template>
  <div ref="subOptionRef" class="sub-option" @mouseleave="handleMouseLeave">
    <div :class="classNames" @click.stop="handleClick" @mouseenter="handleHover">
      <slot :item="{ label }" name="title">
        <span>{{ label }}</span>
      </slot>
    </div>
    <Transition>
      <div v-show="subOptionVisible" :class="subOptionPosition" :style="`width:${width}px`">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, provide, ref } from 'vue';

import { PopMenuProvide } from './PopMenu.vue';
import { PopMenuOptGroupProvide } from './PopMenuOptGroup.vue';
import type { DisabledType } from './PopMenuOption.vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    value: string | number;
    disabled?: DisabledType;
    width?: number;
  }>(),
  {
    label: () => '',
    width: 200,
  }
);

const subOptionRef = ref();

const subOptionVisible = ref<boolean>(false);

const subOptionPosition = ref<string>('sub-option-right');

const nodeValues = ref<(string | number)[]>([]);

const offsetWidth = ref<string>();

const maxHeight = ref<string>();

const popMenu = inject<PopMenuProvide>('popMenu', {});
const popMenuOptGroup = inject<PopMenuOptGroupProvide>('popMenuOptGroup', {});
nodeValues.value = inject('nodeValues', []);

const handleClick = () => {
  if (props.disabled?.clickEvent) {
    return;
  }
  if (popMenuOptGroup?.disabled?.clickEvent) {
    return;
  }
  if (popMenu && typeof popMenu.handleClick === 'function') {
    popMenu.handleClick(nodeValues.value);
  }
};

const caculateStyle = () => {
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;
  const parentNodeRect = subOptionRef.value?.parentNode?.getBoundingClientRect();
  const currentNodeRect = subOptionRef.value?.getBoundingClientRect();
  maxHeight.value = clientHeight - currentNodeRect.top - 10 + 'px';
  subOptionPosition.value = clientWidth - parentNodeRect.right >= props.width ? 'sub-option-right' : 'sub-option-left';
  offsetWidth.value = `${parentNodeRect.width}px`;
};

const handleHover = () => {
  caculateStyle();
  subOptionVisible.value = true;
  if (nodeValues.value.includes(props.value)) {
    return;
  }
  nodeValues.value.push(props.value);
};

const handleMouseLeave = () => {
  subOptionVisible.value = false;
};

const classNames = computed(() =>
  props.disabled?.clickEvent ? ['pop-menu-option', 'pop-menu-option-disabled'] : ['pop-menu-option']
);

provide<(string | number)[]>('nodeValues', nodeValues.value);
</script>

<style lang="scss" scoped>
$offsetWidth: v-bind('offsetWidth');
.pop-menu-option {
  cursor: pointer;
  border-bottom: 1px solid #333;
  padding: 12px;

  &:hover {
    background-color: rgb(119, 118, 118);
  }
}

%sub-option-common {
  position: absolute;
  top: 0px;
  background: rgb(255, 255, 255);
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  max-height: v-bind('maxHeight');
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}

.sub-option {
  .sub-option-left {
    @extend %sub-option-common;
    right: $offsetWidth;
  }

  .sub-option-right {
    @extend %sub-option-common;
    left: $offsetWidth;
  }
}
</style>
