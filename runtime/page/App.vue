<template>
  <edoms-ui-page :config="pageConfig"></edoms-ui-page>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';

import Core from '@edoms/core';

export default defineComponent({
  name: 'App',

  setup() {
    const app = inject<Core | undefined>('app');
    const pageConfig = reactive(app?.page?.data || {});

    return {
      pageConfig,
    };
  },
});
</script>
