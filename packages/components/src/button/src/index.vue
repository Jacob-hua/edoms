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
import useCommonResponse from '@/useCommonResponse'

interface Props {
  node: EdButton
}

const props = defineProps<Props>()

const node: EdButton = reactive(props.node)

const textNode = computed<EdText>(() => ({
  id: '',
  type: 'edom-text',
  text: node.text,
  disabledText: node.disabledText,
  disabled: node.disabled,
}))

const onClickButton = () => {
  console.log('触发', ActionEnum.CLICK)
}

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
