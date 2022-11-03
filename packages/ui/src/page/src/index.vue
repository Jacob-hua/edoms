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

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import type { MPage } from '@edoms/schema';

import Component from '../../Component.vue';
import useApp from '../../useApp';

export default defineComponent({
  components: {
    'edoms-ui-component': Component,
  },

  props: {
    config: {
      type: Object as PropType<MPage>,
      default: () => ({}),
    },
  },

  setup(props) {
    const { app } = useApp(props);

    return {
      style: computed(() => app?.transformStyle(props.config.style || {})),

      refresh() {
        window.location.reload();
      },
    };
  },
});
</script>
