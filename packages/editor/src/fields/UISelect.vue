<template>
  <div v-if="uiSelectMode" class="m-fields-ui-select" @click="cancelHandler">
    <ElButton type="danger" :icon="Delete" text style="padding: 0">{{ $t('editor.cancel') }}</ElButton>
  </div>
  <div v-else class="m-fields-ui-select" style="display: flex" @click="startSelect">
    <ElTooltip v-if="val" :content="$t('editor.clear1')">
      <ElButton style="padding: 0" type="danger" :icon="Close" text @click.stop="deleteHandler"></ElButton>
    </ElTooltip>
    <ElTooltip :content="val ? toName + '_' + val : $t('editor.cliskSele')">
      <ElButton text style="padding: 0; margin: 0">{{ val ? toName + '_' + val : $t('editor.cliskSele') }}</ElButton>
    </ElTooltip>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import { Close, Delete } from '@element-plus/icons-vue';

import { ElButton, ElTooltip } from '@edoms/design';
import { FormState } from '@edoms/form';

import { Services } from '../type';

const props = defineProps<{
  config: any;
  model: any;
  prop: string;
  name: string;
}>();

const emit = defineEmits(['change']);

const services = inject<Services>('services');
const mForm = inject<FormState>('mForm');
const val = computed(() => props.model[props.name]);
const uiSelectMode = ref(false);

const cancelHandler = () => {
  if (!services?.uiService) return;
  services.uiService.set<boolean>('uiSelectMode', false);
  uiSelectMode.value = false;
  globalThis.document.removeEventListener('ui-select', clickHandler as EventListener);
};

const clickHandler = ({ detail }: Event & { detail: any }) => {
  if (detail.id) {
    props.model[props.name] = detail.id;
    emit('change', detail.id);
    mForm?.$emit('field-change', props.prop, detail.id);
  }

  if (cancelHandler) {
    cancelHandler();
  }
};

const toName = computed(() => {
  const config = services?.editorService.getNodeById(val.value);
  return config?.name || '';
});

const startSelect = () => {
  if (!services?.uiService) return;
  services.uiService.set<boolean>('uiSelectMode', true);
  uiSelectMode.value = true;
  globalThis.document.addEventListener('ui-select', clickHandler as EventListener);
};

const deleteHandler = () => {
  if (props.model) {
    props.model[props.name] = '';
    emit('change', '');
    mForm?.$emit('field-change', props.prop, '');
  }
};
</script>

<style lang="scss">
.m-fields-ui-select {
  cursor: pointer;
  i {
    margin-right: 3px;
  }
  span {
    color: #2882e0;
  }
}
</style>
