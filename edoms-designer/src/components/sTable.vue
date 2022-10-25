<template>
  <el-table v-bind="attrs" v-on="listeners">
    <slot></slot>
  </el-table>
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue';
const attrs: Record<string, any> = useAttrs();
const listeners = Object.keys(attrs).reduce((listener: Record<string, Function>, key: string) => {
  if (typeof attrs[key] === 'function') {
    listener[key] = attrs[key];
  }
  return listener;
}, {});
</script>

<style lang="scss" scoped></style>
