<template>
  <div ref="workshopContainer"></div>
</template>

<script lang="ts" setup name="WorkshopView">
import { inject, ref, watchEffect } from 'vue';
import Workshop from '@edoms/workshop';
import { WorkshopOptions } from '@/type';

const workshopOptions = inject<WorkshopOptions>('workshopOptions');

const workshopContainer = ref<HTMLDivElement>();

let workshop: Workshop | null = null;

watchEffect(() => {
  if (workshop) {
    return;
  }
  if (!workshopContainer.value) {
    return;
  }
  if (!workshopOptions?.runtimeUrl || !workshopOptions.render) {
    return;
  }
  workshop = new Workshop({
    runtimeUrl: workshopOptions.runtimeUrl,
    render: workshopOptions.render,
    autoScrollIntoView: true,
    highlightContainer: {
      className: 'edoms-container-highlight',
      duration: 800,
    },
    isContainer: (element: HTMLElement) => element.classList.contains('edoms-ui-container'),
  });
  workshop.mount(workshopContainer.value);
  workshop.on('runtime-ready', (rt: any) => {
    console.log(rt);
  });
});
</script>
