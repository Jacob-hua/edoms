<template>
  <edoms-ui-page :config="pageConfig"></edoms-ui-page>
</template>

<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref, watch } from 'vue';

import Core from '@edoms/core';
import { MApp } from '@edoms/schema';
import { getUrlParam } from '@edoms/utils';

const app = inject<Core | undefined>('app');

const pageConfig = ref(app?.page?.data || {});

const dsl = ref<MApp>();

onMounted(() => {
  const isLocalPreview = getUrlParam('localPreview');

  if (isLocalPreview) {
    window.addEventListener('message', setDSL);
  } else {
    dsl.value = (window as any).edomsDSL;
  }
  window.parent && window.parent.postMessage('runtime-ready', '*');
});

onUnmounted(() => {
  window.removeEventListener('message', setDSL);
});

watch(
  () => dsl.value,
  (dsl) => {
    if (!app || !dsl) {
      return;
    }
    app.setConfig(dsl, getUrlParam('page') ?? dsl.index);
    pageConfig.value = app.page?.data || {};
  }
);

function setDSL({ data }: { data: MApp }) {
  dsl.value = data;
}
</script>
