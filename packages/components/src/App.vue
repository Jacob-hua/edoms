<template>
  <div>
    <edom-component v-for="config in configs" :key="config.id" :meta="config" />
  </div>
</template>

<script setup lang="ts">
import { Engine } from '@edoms/engine'
import { computed, inject } from 'vue'

const app = inject<Engine>('app')

const configs = computed(() => {
  if (!app?.page || !app?.page?.components) {
    return []
  }
  const components = [...(app?.page?.components.values() ?? [])]

  return components.map(({ data }) => data)
})
</script>

<style scoped></style>
