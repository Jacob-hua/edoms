<template>
  <el-button type="primary" @click="onClickButton">
    <slot>
      <edom-text :meta="textMeta"></edom-text>
    </slot>
  </el-button>
</template>

<script lang="ts" setup name="edom-button">
import { EdButton, EdText } from '@/schema'
import { computed, reactive } from 'vue'
import { ActionEnum } from './linkage'
import useCommonResponse from '@/useCommonResponse'

interface Props {
  meta: EdButton
}

const props = defineProps<Props>()

const meta: EdButton = reactive(props.meta)

const textMeta = computed<EdText>(() => ({
  id: '',
  type: 'edom-text',
  text: meta.text,
  disabledText: meta.disabledText,
  disabled: meta.disabled,
}))

const onClickButton = () => {
  console.log('触发', ActionEnum.CLICK)
}

defineExpose({
  disabled: () => {
    meta.disabled = true
  },
  enabled: () => {
    meta.disabled = false
  },
  ...useCommonResponse(meta),
})
</script>
