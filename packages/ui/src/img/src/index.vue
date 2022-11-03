<template>
  <img class="edoms-ui-img" :src="imgSrc" @click="clickHandler" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import { MImg } from '../../types';
import useApp from '../../useApp';

import { SetSrcProps } from './type';

const props = defineProps<{
  config: MImg;
}>();

const { provideMethod } = useApp(props);

const imgSrc = ref(props.config.src);

watch(
  () => props.config.src,
  (value) => (imgSrc.value = value),
  { immediate: true }
);

const clickHandler = () => {
  if (props.config.url) window.location.href = props.config.url;
};

provideMethod('setSrc', ({ src }: SetSrcProps) => (imgSrc.value = src), ['src']);
</script>
