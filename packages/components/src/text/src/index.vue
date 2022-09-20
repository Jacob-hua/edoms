<template>
  <span>{{ displayText }}</span>
</template>

<script lang="ts" setup name="edom-text">
import { EdText } from '@/schema'
import { computed, reactive } from 'vue'
import useCommonEffect from '@/useCommonEffect'

interface Props {
  meta: EdText
}

const props = defineProps<Props>()

const meta: EdText = reactive(props.meta)

const displayText = computed(() => {
  let displayText = meta.text ?? ''
  if (meta.disabled && meta?.disabledText) {
    displayText = meta.disabledText
  }
  return displayText
})

defineExpose({
  disabled: () => {
    meta.disabled = true
  },
  enabled: () => {
    meta.disabled = false
  },
  ...useCommonEffect(meta),
})
</script>
