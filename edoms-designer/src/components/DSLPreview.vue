<template>
  <div v-loading="loading" class="wrapper">
    <iframe v-if="dsl" ref="runtimeIframe" :width="width" :height="height" :src="previewUrl"></iframe>
    <el-empty v-else></el-empty>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRaw, watch, watchEffect } from 'vue';

import { Id, MApp } from '@edoms/schema';

import useDownloadDSL from '@/hooks/useDownloadDSL';

const props = withDefaults(
  defineProps<{
    contentId?: string | null | undefined;
    pageId?: string | Id;
    width?: string | number;
    height?: string | number;
  }>(),
  {
    width: () => '100%',
    height: () => 'auto',
  }
);

const loading = ref<boolean>(true);

const { VITE_RUNTIME_PATH } = import.meta.env;

const runtimeUrl = `${VITE_RUNTIME_PATH}/page/index.html`;

const previewUrl = computed(() => `${runtimeUrl}?localPreview=1&page=${props.pageId}`);

const runtimeIframe = ref<HTMLIFrameElement>();

const dsl = ref<MApp | undefined>();

const { execute: downloadDslExecute } = useDownloadDSL();

watchEffect(async () => {
  if (!props.contentId) {
    dsl.value = undefined;
    loading.value = false;
    return;
  }

  const remoteDsl = await downloadDslExecute(props.contentId);
  dsl.value = remoteDsl;
});

watch(
  () => runtimeIframe.value,
  (runtimeIframe) => {
    runtimeIframe?.contentWindow?.location.reload();
    runtimeIframe?.addEventListener('load', handleIframeLoad);
  }
);

function handleIframeLoad() {
  console.log('发送消息');

  if (!dsl.value) {
    return;
  }
  runtimeIframe.value?.contentWindow?.postMessage(toRaw(dsl.value), runtimeUrl);
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
