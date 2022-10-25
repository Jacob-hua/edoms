<template>
  <component
    v-if="display()"
    :id="config.id"
    :is="tagName"
    :class="`edoms-ui-component${config.className ? ` ${config.className}` : ''}`"
    :style="style"
    :config="config"
  ></component>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, provide } from 'vue';

import Core from '@edoms/core';
import { toLine } from '@edoms/utils';

export default defineComponent({
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const vm = getCurrentInstance()?.proxy;
    const app: Core | undefined = inject('app');

    provide('hoc', vm);

    return {
      tagName: computed(() => `edoms-ui-${toLine(props.config.type)}`),
      style: computed(() => app?.transformStyle(props.config.style)),

      display: () => {
        const displayCfg = props.config?.display;

        if (typeof displayCfg === 'function') {
          return displayCfg(app);
        }
        return displayCfg !== false;
      },
    };
  },
});
</script>
