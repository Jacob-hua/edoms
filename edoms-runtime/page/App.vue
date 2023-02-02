<template>
  <edoms-ui-page :config="pageConfig"></edoms-ui-page>
  <!-- <RouterView></RouterView> -->
</template>

<script lang="ts" setup>
import { h, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouteRecordRaw } from 'vue-router';

import Core from '@edoms/core';
import { MApp, MPage } from '@edoms/schema';
import { getUrlParam } from '@edoms/utils';

const app = inject<Core | undefined>('app');

const pageConfig = ref(app?.page?.data || {});

const dsl = ref<MApp>();

const routes = ref<RouteRecordRaw[]>([]);

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
    routes.value = dsl.items.reduce(
      (routes, page: MPage) => [
        ...routes,
        {
          path: `/${page.id}`,
          name: page.name,
          component: h('edoms-ui-page', { config: page, name: page.id }),
        },
      ],
      [] as RouteRecordRaw[]
    );
  }
);

function setDSL({ data }: { data: MApp }) {
  dsl.value = data;
}
</script>
