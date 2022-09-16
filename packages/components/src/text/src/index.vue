<template>
  <span>{{ displayText }}</span>
</template>

<script lang="ts" setup name="edom-text">
import { EdText } from '@/schema'
import { computed, reactive } from 'vue'
import useCommonResponse from '@/useCommonResponse'

interface Props {
  node: EdText
}

const props = defineProps<Props>()

const node: EdText = reactive(props.node)

const displayText = computed(() => {
  let displayText = node.text ?? ''
  if (node.disabled && node?.disabledText) {
    displayText = node.disabledText
  }
  return displayText
})

defineExpose({
  disabled: () => {
    node.disabled = true
  },
  enabled: () => {
    node.disabled = false
  },
  ...useCommonResponse(node),
})
</script>
