<template>
  <div class="edoms-editor-props-panel">
    <slot name="props-panel-header"></slot>
    <m-form
      ref="configForm"
      :class="`edoms-editor-props-panel ${propsPanelSize}`"
      :popper-class="`edoms-editor-props-panel-popper ${propsPanelSize}`"
      :size="propsPanelSize"
      :init-values="values"
      :config="curFormConfig"
      @change="submit"
    ></m-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onMounted, ref, watch, watchEffect } from 'vue';

import { elMessage } from '@edoms/design';
import type { FormValue, MForm } from '@edoms/form';
import type { MNode } from '@edoms/schema';
import type StageCore from '@edoms/stage';

import type { Services } from '../type';

const emit = defineEmits(['mounted']);

const internalInstance = getCurrentInstance();
const values = ref<FormValue>({});
const configForm = ref<InstanceType<typeof MForm>>();
// ts类型应该是FormConfig， 但是打包时会出错，所以暂时用any
const curFormConfig = ref<any>([]);
const services = inject<Services>('services');
const node = computed(() => services?.editorService.get<MNode | null>('node'));
const propsPanelSize = computed(() => services?.uiService.get('propsPanelSize') || 'small');
const stage = computed(() => services?.editorService.get<StageCore>('stage'));

const init = async () => {
  if (!node.value) {
    curFormConfig.value = [];
    return;
  }

  const type = node.value.type || (node.value.items ? 'container' : 'text');
  curFormConfig.value = (await services?.propsService.getPropsConfig(type)) || [];
  values.value = node.value;
};
init();

watch(
  () => node.value,
  async (node, oldNode) => {
    if (!node) {
      curFormConfig.value = [];
      return;
    }
    if (node.id !== oldNode?.id) {
      const type = node.type || (node.items ? 'container' : 'text');
      curFormConfig.value = (await services?.propsService.getPropsConfig(type)) || [];
    }
    values.value = node;
  }
);
services?.propsService.on('props-configs-change', init);

onMounted(() => {
  emit('mounted', internalInstance);
});

watchEffect(() => {
  if (configForm.value && stage.value) {
    configForm.value.formState.stage = stage.value;
  }
});

const submit = async () => {
  try {
    const values = await configForm.value?.submitForm();
    services?.editorService.update(values);
  } catch (e: any) {
    console.error(e);
    elMessage.closeAll();
    elMessage.error(e.message);
  }
};

defineExpose({ submit });
</script>
