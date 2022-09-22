<template>
  <span>{{ displayText }}</span>
</template>

<script lang="ts" setup name="edom-text">
import { EdText } from '@edoms/meta-model'
import { computed, reactive } from 'vue'
import useCommonEffect from '@/useCommonEffect'
import useApp from '@/useApp'

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

useApp({
  meta: props.meta,
  effects: {
    disabled: (data: any) => {
      console.log(`触发了${meta.id}文本禁用`, data)
      meta.disabledText = data
      meta.disabled = true
    },
    enabled: (data: any) => {
      console.log(`触发了${meta.id}文本启动`, data)
      meta.disabled = false
    },
    ...useCommonEffect(meta),
  },
})
</script>
