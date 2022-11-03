<template>
  <div
    v-if="display()"
    :id="`${config.id || ''}`"
    :class="`edoms-ui-container edoms-layout-${config.layout}${config.className ? ` ${config.className}` : ''}`"
    :style="style"
  >
    <slot></slot>
    <edoms-ui-component v-for="item in config.items" :key="item.id" :config="item"></edoms-ui-component>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import type { MContainer } from '@edoms/schema';

import EdomsUiComponent from '../../Component.vue';
import useApp from '../../useApp';

const props = defineProps<{
  config: MContainer;
}>();

const { app } = useApp(props);

const style = computed(() => app?.transformStyle(props.config.style || {}));

const display = () => {
  const displayCfg = props.config?.display;

  if (typeof displayCfg === 'function') {
    return displayCfg(app);
  }
  return displayCfg !== false;
};

defineExpose({
  display,
});
</script>
