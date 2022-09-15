<template>
  <span>{{ displayText }}</span>
</template>

<script lang="ts" setup name="edom-text">
import { EdText } from '@/schema'
import { computed, getCurrentInstance, ComponentPublicInstance } from 'vue'

interface Props {
  node: EdText
}

type Instance =
  | ComponentPublicInstance<
      Props,
      {},
      {
        [propName: string]: any
      }
    >
  | null
  | undefined

const props = defineProps<Props>()

const vm: Instance = getCurrentInstance()?.proxy as Instance

const displayText = computed(() => {
  let displayText = props.node.text ?? ''
  if (props.node.disabled && props.node?.disabledText) {
    displayText = props.node.disabledText
  }
  if (typeof displayText === 'function') {
    return displayText.apply(vm, [vm, {}])
  }
  return displayText
})

defineExpose({
  disabled: () => {
    console.log('禁用文本')
  },
  enabled: () => {
    console.log('启用文本')
  },
})
</script>
