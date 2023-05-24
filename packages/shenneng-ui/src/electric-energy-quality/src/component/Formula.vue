<template>
  <div>
    <div ref="mathContent"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import katex from 'katex';

import 'katex/dist/katex.min.css';
const props = defineProps<{
  option: any;
}>();
const mathContent = ref<HTMLDivElement | null>(null);
onMounted(async () => {
  katex.render(props.option, mathContent.value, {
    throwOnError: false,
  });
});
</script>

<style lang="scss" scoped></style>
