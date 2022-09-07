<template>
  <el-button type="primary">{{ name }}</el-button>
</template>

<script lang="ts">
export default {
  name: 'EdButton',
}
</script>

<script lang="ts" setup>
import { EdNode } from '@/schema'
import { computed } from 'vue'

interface Props {
  node: EdNode
}

const props = defineProps<Props>()

const name = computed(() => props.node.name)
</script>
