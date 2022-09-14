<template>
  <el-button type="primary">
    <slot>
      <edom-text :node="textNode"></edom-text>
    </slot>
  </el-button>
</template>

<script lang="ts" setup name="edom-button">
import { EdButton, EdText } from '@/schema'
import { computed } from 'vue'

interface Props {
  node: EdButton
}

const props = defineProps<Props>()

const textNode = computed<EdText>(() => ({
  id: 'ddd',
  name: 'ddd',
  type: 'EdText',
  text: props.node.text,
  disableText: props.node.disabledText,
}))

console.log(textNode)
</script>
