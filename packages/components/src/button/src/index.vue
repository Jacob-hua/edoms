<template>
  <el-button type="primary" @click="onClickButton">
    <slot>
      <edom-text :meta="textMeta"></edom-text>
    </slot>
  </el-button>
</template>

<script lang="ts" setup name="edom-button">
import { EdButton, EdText } from '@edoms/meta-model'
import { computed, reactive } from 'vue'
import { ActionEnum } from './config'
import useApp from '@/useApp'

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

const app = useApp(props)

const onClickButton = () => {
  app?.fire(ActionEnum.CLICK, 333)
}
</script>
