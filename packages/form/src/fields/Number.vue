<template>
  <ElInput
    v-if="model"
    v-model="model[name]"
    controls-position="right"
    type="number"
    :size="size"
    :max="config.max"
    :min="config.min"
    :step="config.step"
    :placeholder="config.placeholder"
    :disabled="disabled"
    @change="changeHandler"
    @input="inputHandler"
  >
    <template v-if="config.append" #append>
      <span v-if="typeof config.append === 'string'">{{ config.append }}</span>
      <el-button
        v-if="typeof config.append === 'object' && config.append.type === 'button'"
        style="color: #409eff"
        :size="size"
        @click.prevent="buttonClickHandler"
      >
        {{ config.append.text }}
      </el-button>
    </template>
  </ElInput>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { ElInput } from '@edoms/design';

import { FormState, NumberConfig } from '../schema';
import { useAddField } from '../utils/useAddField';

const props = defineProps<{
  config: NumberConfig;
  model: any;
  initValues?: any;
  values?: any;
  name: string;
  prop: string;
  disabled?: boolean;
  size: 'mini' | 'small' | 'medium';
}>();

const emit = defineEmits(['change', 'input']);

useAddField(props.prop);

const mForm = inject<FormState | undefined>('mForm');

const changeHandler = (value: number) => {
  emit('change', value);
};

const inputHandler = (v: string) => {
  emit('input', v);
  mForm?.$emit('field-input', props.prop, v);
};

const buttonClickHandler = () => {
  if (typeof props.config.append === 'string') return;

  if (props.config.append?.handler) {
    props.config.append.handler(mForm, {
      model: props.model,
      values: mForm?.values,
    });
  }
};
</script>
