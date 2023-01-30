<template>
  <img ref="imgRef" class="edoms-ui-img" :src="imgSrc" @click="clickHandler" />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import useApp from '../../useApp';

import Siact from './assets/siact-cloud.png';
import { MImg } from './type';

const props = defineProps<{
  config: MImg;
}>();

const { provideMethod } = useApp(props);

const imgRef = ref<HTMLImageElement>();

const imgSrc = ref<string>(props.config.src?.[0] ?? '');

const imgFileUrl = ref<string>('');

watch(
  () => props.config.src,
  (value) => {
    if (!value || value.length === 0) {
      imgSrc.value = Siact;
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
  // TODO: 此处应该通过配置文件来配置请求路径
  imgSrc.value = `http://k8s.isiact.com/edoms-designtime-service-dev/edoms/design-time/file/preview/?contentId=${imgFileUrl.value}`;
}
</script>
