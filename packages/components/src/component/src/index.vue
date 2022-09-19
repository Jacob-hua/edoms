<template>
  <component :is="tagName" :config="config" :style="style"></component>
</template>

<script lang="ts" setup name="edom-component">
import { EdNode } from '@/schema'
import { computed, reactive } from 'vue'

interface Props {
  config: EdNode
}
const props = defineProps<Props>()

const config: EdNode = reactive(props.config)

const tagName = computed(() => `edom-${config.type}`)

const style = computed(() => config.style)
</script>
