<template>
  <edoms-ui-page :config="pageConfig"></edoms-ui-page>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';

import Core from '@edoms/core';
import { getUrlParam } from '@edoms/utils';

const app = inject<Core | undefined>('app');
const pageConfig = ref(app?.page?.data || {});

window.addEventListener('message', ({ data }) => {
  if (!app) {
    return;
  }
  app.setConfig(data, getUrlParam('page'));
  pageConfig.value = app.page?.data || {};
});

onMounted(() => {
  window.parent && window.parent.postMessage('runtime-ready', '*');
});
</script>
