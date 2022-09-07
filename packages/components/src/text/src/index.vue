<template>
  <span>{{ text }}</span>
</template>

<script lang="ts">
export default {
  name: 'EdText',
}
</script>

<script lang="ts" setup>
import { EdText } from '@/schema'
import { computed, getCurrentInstance } from 'vue'
import { Instance } from './type'

const props = defineProps<{
  node: EdText
}>()

const vm: Instance = getCurrentInstance()?.proxy

const text = computed(() => {
  let text = props.node.text ?? ''
  if (props.node?.disableText) {
    text = props.node.disableText
  }
  if (typeof text === 'function') {
    return text.apply(vm, [vm, {}])
  }
  return text
})
</script>
