<template>
  <div ref="workshopContainer" class="workshopWrapper"></div>
</template>

<script lang="ts" setup name="WorkshopView">
import { inject, ref, watchEffect } from 'vue';
import Workshop, { Runtime } from '@edoms/workshop';
import { WorkshopOptions } from '@/type';
import { EdApplication } from '@edoms/meta-model';

const appMeta = inject<EdApplication>('root');

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
  workshop.on('runtime-ready', (rt: Runtime) => {
    rt.updateAppMeta && appMeta && rt.updateAppMeta(appMeta);
  });
  workshop.on('select', (element: HTMLElement) => {
    console.log('select element is', element);
  });
});
</script>

<style lang="scss">
.workshopWrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
