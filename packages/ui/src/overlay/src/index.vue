<template>
  <edoms-ui-container v-if="visible" class="edoms-ui-overlay" :config="{ items: config.items }">
    <slot></slot>
  </edoms-ui-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type { MContainer, MNode } from '@edoms/schema';

import useApp from '../../useApp';

const props = defineProps<{
  config: MContainer;
}>();

const visible = ref(false);
const { app, provideMethod } = useApp(props);
const node = app?.page?.getNode(props.config.id);

const openOverlay = provideMethod('openOverlay', () => {
  visible.value = true;
  if (app) {
    app.emit('overlay:open', node);
  }
});

const closeOverlay = provideMethod('closeOverlay', () => {
  visible.value = false;
  if (app) {
    app.emit('overlay:close', node);
  }
});

app?.on('editor:select', (info, path) => {
  if (path.find((node: MNode) => node.id === props.config.id)) {
    openOverlay();
  } else {
    closeOverlay();
  }
});
</script>
