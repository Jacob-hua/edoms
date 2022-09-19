<template>
  <component :is="tagName" :meta="meta" :style="style"></component>
</template>

<script lang="ts" setup name="edom-component">
import { EdNode } from '@/schema'
import { computed, reactive } from 'vue'

interface Props {
  meta: EdNode
}
const props = defineProps<Props>()

const meta: EdNode = reactive(props.meta)

const tagName = computed(() => `edom-${meta.type}`)

const style = computed(() => meta.style)
</script>
