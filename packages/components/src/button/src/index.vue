<template>
  <el-button type="primary" @click="onClickButton">
    <slot>
      <edom-text :config="textNode"></edom-text>
    </slot>
  </el-button>
</template>

<script lang="ts" setup name="edom-button">
import { EdButton, EdText } from '@/schema'
import { computed, reactive } from 'vue'
import { ActionEnum } from './linkage'
import useCommonResponse from '@/useCommonResponse'

interface Props {
  config: EdButton
}

const props = defineProps<Props>()

const config: EdButton = reactive(props.config)

const textNode = computed<EdText>(() => ({
  id: '',
  type: 'edom-text',
  text: config.text,
  disabledText: config.disabledText,
  disabled: config.disabled,
}))

const onClickButton = () => {
  console.log('触发', ActionEnum.CLICK)
}

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
