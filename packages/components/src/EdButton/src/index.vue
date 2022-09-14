<template>
  <el-button type="primary">{{ name }}</el-button>
</template>

<script lang="ts" setup name="EdButton">
import { EdNode } from '@/schema'
import { computed } from 'vue'

interface Props {
  node: EdNode
}

const props = defineProps<Props>()

const name = computed(() => props.node.name)
</script>
