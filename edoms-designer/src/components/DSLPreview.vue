<template>
  <div class="wrapper">
    <iframe v-if="dsl" ref="runtimeIframe" title="preview" :width="width" :height="height" :src="previewUrl"></iframe>
    <el-empty v-else></el-empty>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRaw, watch, watchEffect } from 'vue';

import { Id, MApp } from '@edoms/schema';
import { isURL } from '@edoms/utils';

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

const runtimeUrl = isURL(VITE_RUNTIME_PATH) ? `${VITE_RUNTIME_PATH}` : `${window.location.origin}${VITE_RUNTIME_PATH}`;

const previewUrl = computed<string>(() => {
  const previewUrl = new URL(`${runtimeUrl}/page/index.html`);
  if (props.pageId) {
    previewUrl.searchParams.set('page', `${props.pageId}`);
  }
  previewUrl.searchParams.set('localPreview', '1');
  return previewUrl.toString();
});

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
  loading.value = true;
  runtimeIframe.value?.contentWindow?.location.reload();
});

watch(
  () => runtimeIframe.value,
  (runtimeIframe) => {
    runtimeIframe?.contentWindow?.location.reload();
    runtimeIframe?.addEventListener('load', handleIframeLoad);
  }
);

function handleIframeLoad() {
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
