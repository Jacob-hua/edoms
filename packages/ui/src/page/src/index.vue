<template>
  <div
    :id="`${config.id || ''}`"
    :class="`edoms-ui-page edoms-ui-container edoms-layout-${config.layout}${
      config.className ? ` ${config.className}` : ''
    }`"
    :style="style"
  >
    <slot></slot>
    <edoms-ui-component v-for="item in config.items" :key="item.id" :config="item"></edoms-ui-component>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import type { MPage } from '@edoms/schema';

import EdomsUiComponent from '../../Component.vue';
import useApp from '../../useApp';

const props = defineProps<{
  config: MPage;
}>();

const { app, provideMethod } = useApp(props);

const style = computed(() => app?.transformStyle(props.config.style || {}));

provideMethod('refresh', () => {
  window.location.reload();
});
</script>
