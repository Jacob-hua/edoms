<template>
  <span>{{ displayText }}</span>
</template>

<script lang="ts" setup name="EdText">
import { EdText } from '@/schema'
import { computed, getCurrentInstance } from 'vue'
import { Instance } from './type'

const props = defineProps<{
  node: EdText
}>()

const vm: Instance = getCurrentInstance()?.proxy

const displayText = computed(() => {
  let displayText = props.node.text ?? ''
  if (props.node.disabled && props.node?.disableText) {
    displayText = props.node.disableText
  }
  if (typeof displayText === 'function') {
    return displayText.apply(vm, [vm, {}])
  }
  return displayText
})
</script>
