<template>
  <iframe ref="runtimeIframe" :width="width" :height="height" :src="previewUrl"></iframe>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';

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

const { VITE_RUNTIME_PATH } = import.meta.env;

const runtimeIframe = ref<HTMLIFrameElement | null>(null);

const previewUrl = computed(() => `${VITE_RUNTIME_PATH}/page/index.html?localPreview=1&page=${props.pageId}`);

watchEffect(async () => {
  if (!runtimeIframe.value || !props.contentId) {
    return;
  }
  const dsl = generateEmptyAppDSL({
    applicationId: props.applicationId,
    applicationName: props.applicationName,
  });
  const { execute } = useDownloadDSL(props.contentId);
  const pageDsl = await execute();
  dsl.items.push(pageDsl);
  runtimeIframe.value.addEventListener('load', () => {
    runtimeIframe.value?.contentWindow?.postMessage(dsl, `${VITE_RUNTIME_PATH}/page/index.html`);
  });
});
</script>
