<template>
  <span>{{ displayText }}</span>
</template>

<script lang="ts" setup name="edom-text">
import { EdText } from '@edoms/meta-model'
import { computed, reactive } from 'vue'
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

const app = useApp(props)

app.provideEffect('disabled', () => {
  meta.disabled = true
})

app.provideEffect('enabled', () => {
  meta.disabled = false
})

app.provideEffect('updateText', ({ text, disabledText }: { text: any; disabledText: any }) => {
  meta.text = text
  meta.disabledText = disabledText
})
</script>
