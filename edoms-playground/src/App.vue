<template>
  <edoms-editor
    :model-value="modelValue"
    :runtime-url="runtimeUrl"
    :render="render"
    :moveable-options="moveableOptions"
  />
</template>

<script setup lang="ts">
import mockData from './mock';

const runtimeUrl = '/edoms/playground/runtime/playground.html';
const render = () => {};
const moveableOptions = {};
const modelValue = mockData;
</script>

<style scoped></style>
