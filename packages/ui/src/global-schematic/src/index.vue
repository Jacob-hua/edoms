<template>
  <img ref="imgRef" :src="imgSrc" />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import useApp from '../../useApp';

import { MGlobalSchematic } from './type';

const props = defineProps<{
  config: MGlobalSchematic;
}>();

useApp(props);

// const originUrl = window.location.origin;

const imgRef = ref<HTMLImageElement>();

const imgSrc = ref(props.config.src);

const imgFileUrl = ref<string>('');

watch(
  () => props.config.src,
  (value: any) => {
    if (!value) {
      imgSrc.value = 'https://puui.qpic.cn/vupload/0/1573555382625_bhp0wud8l6w.png/0';
      return;
    }

    const url = value[0].url;
    const suffix = value[0].fileSuffix;
    imgFileUrl.value = url;
    imgSrc.value = `${window.location.origin}/static/${url}${suffix}`;
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  imgRef.value?.addEventListener('error', handleImgError);
});

onUnmounted(() => {
  imgRef.value?.removeEventListener('error', handleImgError);
});

function handleImgError() {
  // TODO: 此处应该通过配置文件来配置请求路径
  imgSrc.value = `http://k8s.isiact.com/edoms-designtime-service-dev/edoms/design-time/file/preview/?contentId=${imgFileUrl.value}`;
}
</script>
