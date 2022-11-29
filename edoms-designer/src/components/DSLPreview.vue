<template>
  <iframe :width="width" :height="height" :src="previewUrl"></iframe>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

withDefaults(
  defineProps<{
    contentId: string;
    width?: string | number;
    height?: string | number;
  }>(),
  {
    width: () => '100%',
    height: () => 'auto',
  }
);

const { VITE_RUNTIME_PATH } = import.meta.env;

const previewUrl = computed(() => `${VITE_RUNTIME_PATH}/page/index.html?localPreview=1`);
</script>
