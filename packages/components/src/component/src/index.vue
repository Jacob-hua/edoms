<template>
  <component :is="tagName" :node="node" :style="style"></component>
</template>

<script lang="ts" setup name="edom-component">
import { EdNode } from '@/schema'
import { computed, reactive } from 'vue'

interface Props {
  node: EdNode
}
const props = defineProps<Props>()

const node: EdNode = reactive(props.node)

const tagName = computed(() => `${node.type}`)

const style = computed(() => node.style)
</script>
