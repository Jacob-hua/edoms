<template>
  <div>
    动态组件
    <EdComponent v-for="config in configs" :key="config.id" :node="config" />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { EdNode } from './schema'

const configs: Ref<EdNode[]> = ref([
  {
    id: '0',
    type: 'EdButton',
    name: 'EDom',
    text: '按钮',
    disableText: '禁用按钮',
  },
  {
    id: '1',
    type: 'EdButton',
    name: 'EDoms组件2',
  },
])
</script>

<style scoped></style>
