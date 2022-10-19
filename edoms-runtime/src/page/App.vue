<template>
  <h1>Vue3 Runtime page</h1>
  <magic-ui-page :config="pageConfig"></magic-ui-page>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';

import Core from '@tmagic/core';

export default defineComponent({
  name: 'App',
  expose: [],
  setup() {
    const app = inject<Core | undefined>('app');
    const pageConfig = reactive(app?.page?.data || {});

    return {
      pageConfig,
    };
  },
});
</script>

<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
}

#app {
  position: relative;
  overflow: auto;
}

#app::-webkit-scrollbar {
  width: 0 !important;
  display: none;
}
</style>
