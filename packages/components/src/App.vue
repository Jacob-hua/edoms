<template>
  <div>
    动态组件
    <edom-component v-for="config in configs" :key="config.id" :meta="config" />
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import { EdApplication } from './schema'

const appInfo: Ref<EdApplication> = ref<EdApplication>({
  id: 'app_0',
  type: 'app',
  name: '冷站监测系统',
  disabeld: false,
  pages: [
    {
      id: 'page_1',
      type: 'page',
      name: '首页',
      children: [
        {
          id: 'text_0',
          type: 'text',
          name: '文本',
          text: '示例文本',
        },
        {
          id: 'text_1',
          type: 'text',
          name: '文本',
          text: '示例文本',
        },
        {
          id: 'text_2',
          type: 'text',
          name: '文本',
          text: '示例文本',
        },
        {
          id: 'button_2',
          type: 'button',
          name: '按钮',
          text: '示例按钮',
          actions: [
            {
              name: 'edom-button:click',
              target: 'text_0',
              effect: 'disabled',
            },
            {
              name: 'edom-button:click',
              target: 'text_1',
              effect: 'disabled',
            },
          ],
        },
      ],
    },
  ],
})

const configs = computed(() => appInfo.value.pages[0].children)
</script>

<style scoped></style>
