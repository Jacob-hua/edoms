<template>
  <button class="edoms-ui-button">
    <slot>
      <edoms-ui-text :config="textConfig"></edoms-ui-text>
    </slot>
  </button>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';

import { MText } from '../../text/src/type';
import useApp from '../../useApp';

import { MButton } from './type';

const props = defineProps<{
  config: MButton;
}>();

const { provideMethod } = useApp(props);

const text = ref<string>(props.config?.text || '');

const setText = provideMethod(
  'setText',
  ({ text: value }) => {
    text.value = value;
  },
  ['text']
);

watchEffect(() => {
  setText({ text: props.config.text || '' });
});

const textConfig = computed<MText>(() => ({
  id: '',
  type: 'text',
  text: text.value,
  disabledText: props.config?.disabledText || '',
  html: props.config?.html || '',
}));
</script>
