<template>
  <component :is="tagName" :node="node"></component>
</template>

<script lang="ts" setup name="edom-component">
import { EdNode } from '@/schema'
import { computed } from 'vue'

interface Props {
  node: EdNode
}
const props = defineProps<Props>()

const tagName = computed(() => `${props.node.type}`)
</script>
