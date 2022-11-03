<template>
  <div v-bind="textAttrs">
    <slot>
      <component v-if="subComponent" :is="subComponent" />
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, useSlots } from 'vue';

import { MComponentInstance, MText, MTextInstance } from '../../../src/types';
import useApp from '../../useApp';

const props = withDefaults(
  defineProps<{
    config: MText;
    model?: Record<string | number | symbol, any>;
    vars?: Record<string | number | symbol, any>;
  }>(),
  {
    model: () => ({}),
    vars: () => ({}),
  }
);

const slots = useSlots();

useApp(props);

const vm: MTextInstance = getCurrentInstance()?.proxy as MTextInstance;

const hoc: MComponentInstance = inject('hoc');

const className = computed(() =>
  props.config?.multiple ? 'edoms-ui-text' : 'edoms-ui-text edoms-ui-text--single-line'
);

const displayText = computed(() => {
  let text = props.config?.text || '';
  const { vars } = props;
  if (hoc?.disabled && props.config?.disabledText) {
    text = props.config.disabledText;
  }
  if (typeof text === 'function') {
    return text.bind(vm)(vm, { model: props.model });
  }
  if (Object.prototype.toString.call(vars) === '[object Object]') {
    let tmp: string = text;
    Object.entries(vars).forEach(([key, value]) => {
      tmp = tmp.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return tmp;
  }
  return text || '';
});

const subComponent = computed(() => {
  if (typeof slots.default === 'function') {
    return slots.default();
  }
  return undefined;
});

const textAttrs = computed(() => ({
  class: className.value,
  ...(displayText.value ? { innerHTML: displayText.value } : {}),
}));
</script>
