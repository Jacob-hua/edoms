<template>
  <div>
    动态组件
    <edom-component v-for="config in configs" :key="config.id" :node="config" />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { EdNode } from './schema'

const configs: Ref<EdNode[]> = ref([
  {
    id: '0',
    type: 'edom-text',
    name: 'text',
    text: '按钮',
    disabledText: '禁用按钮',
    disabled: true,
  },
  {
    id: '1',
    type: 'edom-button',
    name: 'button',
    text: '按钮',
    disabledText: '禁用按阿牛',
    disabled: true,
  },
])
</script>

<style scoped></style>
