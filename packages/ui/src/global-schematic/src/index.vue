<template>
  <img ref="imgRef" :src="imgSrc" />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

import useApp from '../../useApp';

import { MGlobalSchematic } from './type';

const props = defineProps<{
  config: MGlobalSchematic;
}>();

useApp(props);

const imgRef = ref<HTMLImageElement>();

const imgSrc = ref(props.config.src);

watch(
  () => props.config.src,
  (value: any) => {
    if (!value) {
      imgSrc.value = 'https://puui.qpic.cn/vupload/0/1573555382625_bhp0wud8l6w.png/0';
      return;
    }

    const url = value[0].url;
    // TODO: 此处应该优先处理离线时的url，将设计时的url作为候补
    imgSrc.value = `http://k8s.isiact.com/edoms-designtime-service-dev/edoms/design-time/file/preview/?contentId=${url}`;
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  imgRef.value?.addEventListener('error', (event) => {
    console.log(event, '===');
  });
});
</script>
