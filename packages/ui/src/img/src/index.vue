<template>
  <img class="edoms-ui-img" :src="src" @click="clickHandler" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import { MImg } from '../../types';
import useApp from '../../useApp';

const props = defineProps<{
  config: MImg;
}>();

const { provideMethod } = useApp(props);

const src = ref(props.config.src);

watch(
  () => props.config.src,
  (value) => (src.value = value),
  { immediate: true }
);

const clickHandler = () => {
  if (props.config.url) window.location.href = props.config.url;
};

const setSrc = (value: string) => (src.value = value);
provideMethod('setSrc', setSrc);
</script>
