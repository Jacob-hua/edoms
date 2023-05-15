<template>
  <img class="edoms-ui-img" :src="imgSrc" @click="clickHandler" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import useApp from '../../useApp';

import AltImg from './assets/alt.svg';
import { MImg } from './type';

const props = defineProps<{
  config: MImg;
}>();

const { provideMethod, app } = useApp(props);

const imgSrc = ref<string>(AltImg);

watch(
  () => props.config.src,
  (value) => {
    if (!value || value.length === 0) {
      imgSrc.value = AltImg;
      return;
    }
    imgSrc.value = app?.generateImageSrc(props.config.src[0]) ?? AltImg;
  },
  { immediate: true }
);

const clickHandler = () => {
  if (props.config.url) window.location.href = props.config.url;
};

provideMethod('setSrc', ({ src }) => (imgSrc.value = src), ['src']);
</script>
