<template>
  <button class="edoms-ui-button">
    <slot>
      <edoms-ui-text :config="textConfig"></edoms-ui-text>
    </slot>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { MButton, MText } from '../../../src/types';
import useApp from '../../useApp';

const props = withDefaults(
  defineProps<{
    config: MButton;
    model?: Record<string, any>;
  }>(),
  {
    model: () => ({}),
  }
);

useApp(props);

const textConfig = computed<MText>(() => ({
  type: 'text',
  text: props.config?.text || '',
  disabledText: props.config?.disabledText || '',
  html: props.config?.html || '',
}));
</script>
