<template>
  <component :is="tagName" :meta="meta" :style="style"></component>
</template>

<script lang="ts" setup name="edom-component">
import { EdMeta } from '@/schema'
import { computed, reactive } from 'vue'

interface Props {
  meta: EdMeta
}
const props = defineProps<Props>()

const meta: EdMeta = reactive(props.meta)

const tagName = computed(() => `edom-${meta.type}`)

const style = computed(() => meta.style)
</script>
