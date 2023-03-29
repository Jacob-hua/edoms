<template>
  <ElCascader
    ref="edomsCascader"
    v-model="model[name]"
    style="width: 100%"
    clearable
    :filterable="filterable"
    :size="size"
    :placeholder="config.placeholder"
    :disabled="disabled"
    :options="options"
    :props="{ multiple: config.multiple, checkStrictly: config.checkStrictly }"
    @change="changeHandler"
  ></ElCascader>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch, watchEffect } from 'vue';

import { ElCascader } from '@edoms/design';

import { CascaderConfig, FormState } from '../schema';
import { getConfig } from '../utils/config';
import { useAddField } from '../utils/useAddField';

const props = defineProps<{
  config: CascaderConfig;
  model: any;
  initValues?: any;
  values?: any;
  name: string;
  prop: string;
  disabled?: boolean;
  size: 'mini' | 'small' | 'medium';
}>();

const emit = defineEmits(['change']);

const mForm = inject<FormState | undefined>('mForm');

useAddField(props.prop);

const requestFunc = getConfig('request') as Function;

const edomsCascader = ref<InstanceType<typeof ElCascader>>();

const options = Array.isArray(props.config.options) ? ref(props.config.options) : ref([]);
const remoteData = ref<any>(null);

const filterable = computed(() => props.config.filterable ?? false);

watch(
  () => options.value,
  (options) => (props.config.relOptions = options)
);

const setRemoteOptions = async function () {
  const { config } = props;
  const { option } = config;
  if (!option) return;
  let { body } = option;

  const postOptions: Record<string, any> = {
    url: option.url,
    cache: option.cache,
    timeout: option.timeout,
    data: {},
  };

  if (body && mForm) {
    if (typeof body === 'function' && props.model && mForm) {
      body = body(mForm, {
        model: props.model,
        formValue: mForm.values,
        formValues: mForm.values,
        config: props.config,
      });
    }
    postOptions.data = body;
  }

  const res = await requestFunc(postOptions);

  remoteData.value = res[option.root];
  if (remoteData.value && typeof option?.item === 'function') {
    options.value = option.item(res[option.root]);
  }
};

// 初始化
if (typeof props.config.options === 'function') {
  watchEffect(() => {
    typeof props.config.options === 'function' &&
      Promise.resolve(
        props.config.options(mForm, {
          model: props.model,
          prop: props.prop,
          formValues: mForm?.values,
          formValue: mForm?.values,
          config: props.config,
        })
      ).then((data) => {
        options.value = data;
      });
  });
} else if (!props.config.options || !props.config.options.length || props.config.remote) {
  Promise.resolve(setRemoteOptions());
}

const changeHandler = (value: any) => {
  if (!edomsCascader.value) return;
  edomsCascader.value.setQuery('');
  edomsCascader.value.setPreviousQuery(null);
  emit('change', value);
};
</script>

<style lang="scss"></style>
