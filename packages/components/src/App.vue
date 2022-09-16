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
    text: '文本',
    disabledText: '禁用文本',
    disabled: true,
  },
  {
    id: '1',
    type: 'edom-text',
    name: 'text',
    text: '文本',
    disabledText: '禁用文本',
    disabled: true,
  },
  {
    id: '2',
    type: 'edom-text',
    name: 'text',
    text: '文本',
    disabledText: '禁用文本',
    disabled: true,
  },
  {
    id: '3',
    type: 'edom-button',
    name: 'button',
    text: '按钮',
    disabledText: '禁用按钮',
    disabled: true,
    actions: [
      {
        action: 'edom-button:click',
        target: '0',
        response: 'disabled',
      },
      {
        action: 'edom-button:click',
        target: '1',
        response: 'enabled',
      },
      {
        action: 'edom-button:click',
        target: '2',
        response: 'disabled',
      },
    ],
  },
])
</script>

<style scoped></style>
