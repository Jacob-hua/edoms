<template>
  <iframe ref="runtimeIframe" :width="width" :height="height" :src="previewUrl"></iframe>
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

const { VITE_RUNTIME_PATH } = import.meta.env;

const runtimeUrl = `${VITE_RUNTIME_PATH}/page/index.html`;

const previewUrl = computed(() => `${runtimeUrl}?localPreview=1&page=${props.pageId}`);

const runtimeIframe = ref<HTMLIFrameElement | null>(null);

const dsl = ref<MApp | undefined>();

watchEffect(async () => {
  if (!runtimeIframe.value || !props.contentId) {
    return;
  }
  await updateDsl(props.contentId);
  runtimeIframe.value.addEventListener('load', handleIframeLoad);
});

const { execute: downloadDslExecute } = useDownloadDSL();

async function updateDsl(contentId: string) {
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
}

function handleIframeLoad() {
  if (!dsl.value) {
    return;
  }
  runtimeIframe.value?.contentWindow?.postMessage(toRaw(dsl.value), `${VITE_RUNTIME_PATH}/page/index.html`);
}
</script>
