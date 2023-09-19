<template>
  <div :class="className">{{ displayText }}</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import useApp from '../../useApp';

import { MText } from './type';

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

const className = computed(() =>
  props.config?.multiple ? 'edoms-ui-text' : 'edoms-ui-text edoms-ui-text--single-line'
);

const text = ref<string>(props.config.text ?? '');

const disabledText = ref<string>(props.config.disabledText ?? '');

const setText = provideMethod(
  'setText',
  ({ text: value }) => {
    text.value = value;
  },
  ['text']
);

watch(
  () => props.config.text,
  (text = '') => {
    setText({ text });
  },
  {
    immediate: true,
  }
);

const setDisabledText = provideMethod(
  'setDisabledText',
  ({ disabledText: value }) => {
    disabledText.value = value;
  },
  ['disabledText']
);

watch(
  () => props.config.disabledText,
  (disabledText = '') => setDisabledText(disabledText),
  {
    immediate: true,
  }
);

const displayText = computed(() => {
  let displayText = text.value;
  if (props.config?.disabledText) {
    displayText = disabledText.value;
  }
  return displayText;
});
</script>
