<template>
  <el-button type="primary" @click="onClickButton">
    <slot>
      <edom-text :node="textNode"></edom-text>
    </slot>
  </el-button>
</template>

<script lang="ts" setup name="edom-button">
import { EdButton, EdText } from '@/schema'
import { computed, reactive } from 'vue'
import { ActionEnum } from './linkage'

interface Props {
  node: EdButton
}

const props = defineProps<Props>()

const node: EdButton = reactive(props.node)

const textNode = computed<EdText>(() => ({
  type: 'edom-text',
  text: node.text,
  disabledText: node.disabledText,
  disabled: node.disabled,
}))

const onClickButton = () => {
  console.log('触发', ActionEnum.CLICK)
}

console.log(node)
defineExpose({
  disabled: () => {
    node.disabled = true
  },
  enabled: () => {
    node.disabled = false
  },
})
</script>
