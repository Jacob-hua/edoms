<template>
  <img class="edoms-ui-img" :src="config.src" @click="clickHandler" />
</template>

<script lang="ts" setup>
import { MImg } from '../../types';
import useApp from '../../useApp';

const props = withDefaults(
  defineProps<{
    config: MImg;
    model?: Record<string, any>;
  }>(),
  {
    model: () => ({}),
  }
);

useApp(props);

const clickHandler = () => {
  if (props.config.url) window.location.href = props.config.url;
};
</script>
