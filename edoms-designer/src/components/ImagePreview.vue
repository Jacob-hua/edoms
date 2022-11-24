<template>
  <img :src="url" alt="" @click="handleImageClick" />
</template>

<script lang="ts" setup name="PreviewImage">
import { computed } from 'vue';

import NoData from '@/assets/img/no_data.png';

const emits = defineEmits<{
  (event: 'imageClick', ...args: any[]): void;
}>();

const defaultProps = withDefaults(
  defineProps<{
    contentId: string | number | null;
  }>(),
  {
    contentId: () => '',
  }
);
const url = computed(() =>
  defaultProps.contentId ? `${import.meta.env.VITE_BASE_API}/file/preview/?contentId=${defaultProps.contentId}` : NoData
);
const handleImageClick = () => {
  emits('imageClick');
};
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
