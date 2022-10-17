<template>
  <edom-page v-if="pageMeta" :meta="pageMeta"></edom-page>
</template>

<script setup lang="ts">
import { EdApplication, EdId, EdMeta } from '@edoms/meta-model';
import { Engine } from '@edoms/engine';
import { computed, nextTick, onMounted, provide, ref, watch } from 'vue';

const root = ref<EdApplication>();
const currentPageId = ref<EdId>();
const selectedId = ref<EdId>();

const pageMeta = computed(
  () => root.value?.pages.find((item: EdMeta) => item.id === currentPageId.value) || root.value?.pages?.[0]
);

const app = new Engine({
  meta: root.value,
});

provide('app', app);

watch(pageMeta, async () => {
  await nextTick();
  const page = document.querySelector<HTMLElement>('.edoms-ui-page');
  page && window.edoms?.onPageElUpdate(page);
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
  background-color: aquamarine;

  &::-webkit-scrollbar {
    width: 0px;
  }
}
</style>
