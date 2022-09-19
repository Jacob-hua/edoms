<template>
  <span>{{ displayText }}</span>
</template>

<script lang="ts" setup name="edom-text">
import { EdText } from '@/schema'
import { computed, reactive } from 'vue'
import useCommonResponse from '@/useCommonResponse'

interface Props {
  config: EdText
}

const props = defineProps<Props>()

const config: EdText = reactive(props.config)

const displayText = computed(() => {
  let displayText = config.text ?? ''
  if (config.disabled && config?.disabledText) {
    displayText = config.disabledText
  }
  return displayText
})

defineExpose({
  disabled: () => {
    config.disabled = true
  },
  enabled: () => {
    config.disabled = false
  },
  ...useCommonResponse(config),
})
</script>
