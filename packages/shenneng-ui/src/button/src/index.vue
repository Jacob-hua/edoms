<template>
  <button class="edoms-ui-button">
    <slot>
      <edoms-ui-text :config="textConfig"></edoms-ui-text>
    </slot>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { MText } from '../../text/src/type';
import useApp from '../../useApp';

import { MButton } from './type';

const props = defineProps<{
  config: MButton;
}>();

useApp(props);

const textConfig = computed<MText>(() => ({
  id: '',
  type: 'text',
  text: props.config?.text || '',
  disabledText: props.config?.disabledText || '',
  html: props.config?.html || '',
}));
</script>
