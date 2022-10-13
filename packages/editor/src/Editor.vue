<template>
  <WorkshopView />
</template>

<script lang="ts" setup name="EdomsEditor">
import { EdApplication } from '@edoms/meta-model';
import Workshop, { MoveableOptions } from '@edoms/workshop';
import { provide, reactive, watch } from 'vue';
import WorkshopView from './components/Workshop.vue';
import { WorkshopOptions } from './type';

interface PropsInterface {
  runtimeUrl: string;
  modelValue: EdApplication;
  render: () => HTMLDivElement;
  moveableOptions: MoveableOptions | ((workshop?: Workshop) => MoveableOptions);
}

const props = defineProps<PropsInterface>();

watch(
  () => props.modelValue,
  () => {},
  {
    immediate: true,
  }
);

provide(
  'workshopOptions',
  reactive<WorkshopOptions>({
    runtimeUrl: props.runtimeUrl,
    render: props.render,
    moveableOptions: props.moveableOptions,
  })
);
</script>
