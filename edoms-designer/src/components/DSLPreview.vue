<template>
  <iframe :width="width" :height="height" :src="previewUrl"></iframe>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from 'vue';

import useDSL from '@/hooks/useDownloadDSL';

const props = withDefaults(
  defineProps<{
    contentId: string;
    applicationId: string;
    pageId?: string;
    width?: string | number;
    height?: string | number;
  }>(),
  {
    width: () => '100%',
    height: () => 'auto',
  }
);

const { VITE_RUNTIME_PATH } = import.meta.env;

const previewUrl = computed(() => `${VITE_RUNTIME_PATH}/page/index.html?localPreview=1&page=${props.pageId}`);

watchEffect(async () => {
  useDSL(props.contentId);
});
</script>
