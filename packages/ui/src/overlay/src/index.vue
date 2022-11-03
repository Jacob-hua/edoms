<template>
  <edoms-ui-container v-if="visible" class="edoms-ui-overlay" :config="{ items: config.items }">
    <slot></slot>
  </edoms-ui-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { MNode } from '@edoms/schema';

import useApp from '../../useApp';

export default defineComponent({
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },

    model: {
      type: Object,
      default: () => ({}),
    },
  },
  expose: ['openOverlay', 'closeOverlay'],
  setup(props) {
    const visible = ref(false);
    const { app, provideMethod } = useApp(props);
    const node = app?.page?.getNode(props.config.id);

    const openOverlay = () => {
      visible.value = true;
      if (app) {
        app.emit('overlay:open', node);
      }
    };

    const closeOverlay = () => {
      visible.value = false;
      if (app) {
        app.emit('overlay:close', node);
      }
    };

    app?.on('editor:select', (info, path) => {
      if (path.find((node: MNode) => node.id === props.config.id)) {
        openOverlay();
      } else {
        closeOverlay();
      }
    });

    provideMethod('openOverlay', openOverlay);
    provideMethod('closeOverlay', closeOverlay);

    return {
      visible,

      openOverlay,
      closeOverlay,
    };
  },
});
</script>
