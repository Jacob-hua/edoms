<template>
  <button class="edoms-ui-button" @click="clickHandler">
    <slot>
      <edoms-ui-text :config="textConfig"></edoms-ui-text>
    </slot>
  </button>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, reactive } from 'vue';

import { MButton, MButtonInstance, MText } from '../../../src/types';
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

const vm: MButtonInstance = getCurrentInstance()?.proxy as MButtonInstance;
const actions = reactive<Function[]>([]);
const actualActions = computed(() => [
  typeof props.config.preAction === 'function' ? props.config.preAction : () => true,
  ...actions,
  typeof props.config.postAction === 'function' ? props.config.postAction : () => true,
]);

async function clickHandler(): Promise<void> {
  for (const fn of actualActions.value) {
    if (typeof fn === 'function') {
      const ret = await fn(vm, { model: props.model });
      if (ret === false) {
        break;
      }
    }
  }
}

const textConfig = computed<MText>(() => ({
  type: 'text',
  text: props.config?.text || '',
  disabledText: props.config?.disabledText || '',
  html: props.config?.html || '',
}));
</script>
