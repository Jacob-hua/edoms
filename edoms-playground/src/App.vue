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

<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
