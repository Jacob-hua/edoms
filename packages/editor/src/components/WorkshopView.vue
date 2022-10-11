<template>
  <div ref="workshopContainer"></div>
</template>

<script lang="ts" setup name="WorkshopView">
import { ref, watchEffect } from 'vue'
import Workshop from '@edoms/workshop'

const workshopContainer = ref<HTMLDivElement>()

let workshop: Workshop | null = null

watchEffect(() => {
  if (workshop) {
    return
  }
  if (!workshopContainer.value) {
    return
  }
  workshop = new Workshop({
    runtimeUrl: ' http://localhost:8001/edoms/playground/runtime/playground.html',
    render: undefined,
    autoScrollIntoView: true,
    highlightContainer: {
      className: 'edoms-container-highlight',
      duration: 800,
    },
    isContainer: (element: HTMLElement) => element.classList.contains('edoms-ui-container'),
  })
  workshop.mount(workshopContainer.value)
})
</script>
