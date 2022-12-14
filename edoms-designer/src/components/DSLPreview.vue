<template>
  <div v-loading="loading" class="wrapper">
    <iframe v-if="dsl" ref="runtimeIframe" :width="width" :height="height" :src="previewUrl"></iframe>
    <el-empty v-else></el-empty>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRaw, watchEffect } from 'vue';

import { MApp, NodeType } from '@edoms/schema';

import useDownloadDSL from '@/hooks/useDownloadDSL';
import { generateEmptyAppDSL } from '@/util/dsl';

const props = withDefaults(
  defineProps<{
    contentId?: string | null | undefined;
    applicationId?: string;
    applicationName?: string;
    pageId?: string;
    width?: string | number;
    height?: string | number;
  }>(),
  {
    applicationId: () => '',
    applicationName: () => '',
    width: () => '100%',
    height: () => 'auto',
  }
);

const loading = ref<boolean>(true);

const { VITE_RUNTIME_PATH } = import.meta.env;

const runtimeUrl = `${VITE_RUNTIME_PATH}/page/index.html`;

const previewUrl = computed(() => `${runtimeUrl}?localPreview=1&page=${props.pageId}`);

const runtimeIframe = ref<HTMLIFrameElement | null>(null);

const dsl = ref<MApp | undefined>();

const { execute: downloadDslExecute } = useDownloadDSL();

watchEffect(async () => {
  if (!props.contentId) {
    dsl.value = undefined;
    return;
  }
  await updateDsl(props.contentId);
  if (runtimeIframe.value) {
    runtimeIframe.value.contentWindow?.location.reload();
    runtimeIframe.value.addEventListener('load', handleIframeLoad);
  }
});

async function updateDsl(contentId: string) {
  try {
    const remoteDsl = await downloadDslExecute(contentId);
    if (!remoteDsl) {
      return;
    }
    if (remoteDsl.type === NodeType.ROOT) {
      dsl.value = remoteDsl;
    } else {
      const appDsl = generateEmptyAppDSL({
        applicationId: props.applicationId,
        applicationName: props.applicationName,
      });
      appDsl.items.push(remoteDsl);
      dsl.value = appDsl;
    }
  } catch (error) {
    console.error(error);
  }
}

function handleIframeLoad() {
  if (!dsl.value) {
    return;
  }
  runtimeIframe.value?.contentWindow?.postMessage(toRaw(dsl.value), `${VITE_RUNTIME_PATH}/page/index.html`);
}

window.addEventListener('message', (e) => {
  if (e.data === 'runtime-ready') {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
</style>
