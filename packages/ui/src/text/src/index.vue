<template>
  <div :class="className">{{ displayText }}</div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';

import { MComponentInstance, MText } from '../../../src/types';
import useApp from '../../useApp';

const props = withDefaults(
  defineProps<{
    config: MText;
    model?: Record<string | number | symbol, any>;
  }>(),
  {
    model: () => ({}),
  }
);

const { provideMethod } = useApp(props);

const hoc: MComponentInstance = inject('hoc');

const className = computed(() =>
  props.config?.multiple ? 'edoms-ui-text' : 'edoms-ui-text edoms-ui-text--single-line'
);

const text = ref<string>(props.config.text ?? '');

const disabledText = ref<string>(props.config.disabledText ?? '');

const displayText = computed(() => {
  let displayText = text.value;
  if (hoc?.disabled && props.config?.disabledText) {
    displayText = disabledText.value;
  }
  return displayText || '';
});

provideMethod(
  'setText',
  ({ text }) => {
    props.config.text = text;
  },
  ['text']
);
</script>
