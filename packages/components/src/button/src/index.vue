<template>
  <el-button type="primary" @click="onClickButton">
    <slot>
      <edom-text :node="textNode"></edom-text>
    </slot>
  </el-button>
</template>

<script lang="ts" setup name="edom-button">
import { EdButton, EdText } from '@/schema'
import { computed } from 'vue'
import { ActionEnum } from './linkage'

interface Props {
  node: EdButton
}

const props = defineProps<Props>()

const textNode = computed<EdText>(() => ({
  type: 'edom-text',
  text: props.node.text,
  disabledText: props.node.disabledText,
  disabled: props.node.disabled,
}))

const onClickButton = () => {
  console.log('触发', ActionEnum.CLICK)
}

defineExpose({
  disabled: () => {
    console.log('禁用按钮')
  },
  enabled: () => {
    console.log('启用按钮')
  },
})
</script>
