<template>
  <div>playground页面111132323231</div>
</template>

<script setup lang="ts">
import { EdApplication, EdId, EdMeta } from '@edoms/meta-model';
import { Engine } from '@edoms/engine';
import { computed, nextTick, onMounted, provide, ref, watch } from 'vue';

const root = ref<EdApplication>();
const currentPageId = ref<EdId>();
const selectedId = ref<EdId>();

const pageConfig = computed(
  () => root.value?.pages.find((item: EdMeta) => item.id === currentPageId.value) || root.value?.pages?.[0]
);

const app = new Engine({
  meta: root.value,
});

provide('app', app);

watch(pageConfig, async () => {
  await nextTick();
  const page = document.querySelector<HTMLElement>('.edoms-ui-page');
  // TODO: 需要将页面传递给workshop
  page && window.edoms;
});

onMounted(() => {
  window.edoms?.onRuntimeReady({
    getEngine() {
      return app;
    },
    updateAppMeta(meta: EdApplication) {
      root.value = meta;
      app.setMeta(meta);
    },
    select(id: EdId) {
      console.log(id);
      selectedId.value = id;
      const element = document.getElementById(`${id}`);
      if (element) {
        return element;
      }
      return nextTick().then(() => document.getElementById(`${id}`) as HTMLElement);
    },
  });
});
</script>

<style scoped></style>
