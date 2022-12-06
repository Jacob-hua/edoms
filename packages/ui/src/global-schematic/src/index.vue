<template>
  <img :src="imgSrc" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import useApp from '../../useApp';

import { MGlobalSchematic } from './type';

const props = defineProps<{
  config: MGlobalSchematic;
}>();

useApp(props);

const imgSrc = ref(props.config.src);

watch(
  () => props.config.src,
  (value) => {
    imgSrc.value = value;
  },
  {
    immediate: true,
  }
);
</script>
