<template>
  <ElDialog
    v-model="dialogVisible"
    class="m-form-dialog"
    top="20px"
    append-to-body
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :close-on-click-modal="false"
    @close="closeHandler"
  >
    <div
      v-if="dialogVisible"
      class="m-dialog-body"
      :style="`max-height: ${bodyHeight}; overflow-y: auto; overflow-x: hidden;`"
    >
      <Form
        ref="form"
        v-model="stepActive"
        :size="size"
        :config="config"
        :init-values="values"
        :parent-values="parentValues"
        :label-width="labelWidth"
        @change="changeHandler"
      ></Form>
      <slot></slot>
    </div>

    <template #footer>
      <ElRow class="dialog-footer">
        <ElCol :span="12" style="text-align: left">
          <div style="min-height: 1px">
            <slot name="left"></slot>
          </div>
        </ElCol>
        <ElCol :span="12">
          <slot name="footer">
            <ElButton size="small" @click="cancel">取 消</ElButton>
            <ElButton v-if="hasStep && stepActive > 1" type="info" size="small" @click="preStep">上一步</ElButton>
            <ElButton v-if="hasStep && stepCount > stepActive" type="info" size="small" @click="nextStep"
              >下一步</ElButton
            >
            <ElButton v-else type="primary" size="small" :loading="saveFetch" @click="save">{{ confirmText }}</ElButton>
          </slot>
        </ElCol>
      </ElRow>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { ElButton, ElCol, ElDialog, ElRow } from '@edoms/design';

import Form from './Form.vue';
import { FormConfig, StepConfig } from './schema';

const props = withDefaults(
  defineProps<{
    config?: FormConfig;
    values?: Object;
    parentValues?: Object;
    width?: string | number;
    labelWidth?: string;
    fullscreen?: boolean;
    title?: string;
    size?: 'small' | 'default' | 'large';
    confirmText?: string;
  }>(),
  {
    config: () => [],
    values: () => ({}),
    parentValues: () => ({}),
    width: '50%',
    labelWidth: '200px',
    title: 'Title',
    size: 'default',
    confirmText: '确定',
  }
);

const emit = defineEmits(['close', 'submit', 'error', 'change']);

const form = ref<InstanceType<typeof Form>>();
const dialogVisible = ref(false);
const saveFetch = ref(false);
const stepActive = ref(1);
const bodyHeight = ref(`${document.body.clientHeight - 194}px`);

const stepCount = computed(() => {
  const { length } = props.config;
  for (let index = 0; index < length; index++) {
    if (props.config[index].type === 'step') {
      return (props.config[index] as StepConfig).items.length;
    }
  }
  return 0;
});

const hasStep = computed(() => {
  const { length } = props.config;
  for (let index = 0; index < length; index++) {
    if (props.config[index].type === 'step') {
      return true;
    }
  }

  return false;
});

const cancel = () => {
  dialogVisible.value = false;
};

const closeHandler = () => {
  stepActive.value = 1;
  emit('close');
};

const save = async () => {
  try {
    const values = await form.value?.submitForm();
    emit('submit', values);
  } catch (e) {
    emit('error', e);
  }
};

const preStep = () => {
  stepActive.value -= 1;
};

const nextStep = () => {
  stepActive.value += 1;
};

const changeHandler = (value: any) => {
  emit('change', value);
};

defineExpose({
  form,
  saveFetch,
  dialogVisible,

  cancel,
  save,
});
</script>
