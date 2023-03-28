<template>
  <img ref="imgRef" class="edoms-ui-img" :src="imgSrc" @click="clickHandler" />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import useApp from '../../useApp';

import AltImg from './assets/alt.svg';
import { MImg } from './type';

const props = defineProps<{
  config: MImg;
}>();

const { provideMethod, filePreviewFile } = useApp(props);

const imgRef = ref<HTMLImageElement>();

const imgSrc = ref<string>(props.config.src?.[0] ?? '');

const imgFileUrl = ref<string>('');

watch(
  () => props.config.src,
  (value) => {
    if (!value || value.length === 0) {
      imgSrc.value = AltImg;
      return;
    }

    const url = value[0].url;
    const suffix = value[0].fileSuffix;
    imgFileUrl.value = url;
    imgSrc.value = `${window.location.origin}/static/${url}${suffix}`;
  },
  { immediate: true }
);

const clickHandler = () => {
  if (props.config.url) window.location.href = props.config.url;
};

provideMethod('setSrc', ({ src }) => (imgSrc.value = src), ['src']);

onMounted(() => {
  imgRef.value?.addEventListener('error', handleImgError);
});

onUnmounted(() => {
  imgRef.value?.removeEventListener('error', handleImgError);
});

function handleImgError() {
  imgSrc.value = `${filePreviewFile}${imgFileUrl.value}`;
}
</script>
