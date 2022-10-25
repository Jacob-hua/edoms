<template>
  <div
    v-if="config"
    :style="config.tip ? 'display: flex;align-items: baseline;' : ''"
    :class="config.className"
    class="m-form-container"
  >
    <m-fields-hidden
      v-if="type === 'hidden'"
      :model="model"
      :config="config"
      :name="config.name"
      :disabled="disabled"
      :prop="itemProp"
    ></m-fields-hidden>

    <component
      v-else-if="items && !config.text && type && display"
      :key="key(config)"
      :is="tagName"
      :size="size"
      :model="model"
      :config="config"
      :name="name"
      :prop="itemProp"
      :step-active="stepActive"
      :expand-more="expand"
      :label-width="itemLabelWidth"
      @change="onChangeHandler"
    ></component>

    <template v-else-if="type && display">
      <ElFormItem
        :style="config.tip ? 'flex: 1' : ''"
        :class="{ hidden: `${itemLabelWidth}` === '0' || !config.text }"
        :prop="itemProp"
        :label-width="itemLabelWidth"
        :rules="rule"
      >
        <template #label><span v-html="type === 'checkbox' ? '' : config.text"></span></template>
        <ElTooltip v-if="tooltip">
          <component
            :key="key(config)"
            :is="tagName"
            :size="size"
            :model="model"
            :config="config"
            :name="name"
            :disabled="disabled"
            :prop="itemProp"
            @change="onChangeHandler"
          ></component>
          <template #content>
            <div v-html="tooltip"></div>
          </template>
        </ElTooltip>

        <component
          v-else
          :key="key(config)"
          :is="tagName"
          :size="size"
          :model="model"
          :config="config"
          :name="name"
          :disabled="disabled"
          :prop="itemProp"
          @change="onChangeHandler"
        ></component>

        <div v-if="extra" class="m-form-tip" v-html="extra"></div>
      </ElFormItem>

      <ElTooltip v-if="config.tip" placement="left">
        <ElIcon style="line-height: 40px; margin-left: 5px"><warning-filled /></ElIcon>
        <template #content>
          <div v-html="config.tip"></div>
        </template>
      </ElTooltip>
    </template>

    <template v-else-if="items && display">
      <template v-if="name || name === 0 ? model[name] : model">
        <Container
          v-for="item in items"
          :key="key(item)"
          :model="name || name === 0 ? model[name] : model"
          :config="item"
          :size="size"
          :step-active="stepActive"
          :expand-more="expand"
          :label-width="itemLabelWidth"
          :prop="itemProp"
          @change="onChangeHandler"
        ></Container>
      </template>
    </template>

    <div v-if="config.expand && type !== 'fieldset'" style="text-align: center">
      <ElButton text @click="expandHandler">{{ expand ? '收起配置' : '展开更多配置' }}</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, resolveComponent, watchEffect } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';

import { ElButton, ElFormItem, ElIcon, ElTooltip } from '@edoms/design';

import { ChildConfig, ContainerCommonConfig, FormState, FormValue } from '../schema';
import { display as displayFunction, filterFunction, getRules } from '../utils/form';

const props = withDefaults(
  defineProps<{
    model: FormValue;
    config: ChildConfig;
    prop?: string;
    labelWidth?: string;
    expandMore?: boolean;
    stepActive?: string | number;
    size?: string;
  }>(),
  {
    prop: '',
    size: 'small',
    expandMore: false,
  }
);

const emit = defineEmits(['change']);

const mForm = inject<FormState | undefined>('mForm');

const expand = ref(false);

const name = computed(() => props.config.name || '');

const items = computed(() => (props.config as ContainerCommonConfig).items);

const itemProp = computed(() => {
  let n: string | number = '';
  const { names } = props.config as any;
  if (names?.[0]) {
    [n] = names;
  } else if (name.value) {
    n = name.value;
  } else {
    return props.prop;
  }
  return `${props.prop}${props.prop ? '.' : ''}${n}`;
});

const tagName = computed(() => {
  const component = resolveComponent(`m-${items.value ? 'form' : 'fields'}-${type.value}`);
  if (typeof component !== 'string') return component;
  return 'm-fields-text';
});

const disabled = computed(() => filterFunction(mForm, props.config.disabled, props));

const tooltip = computed(() => filterFunction(mForm, props.config.tooltip, props));

const extra = computed(() => filterFunction(mForm, props.config.extra, props));

const rule = computed(() => getRules(mForm, props.config.rules, props));

const type = computed((): string => {
  let { type } = props.config;
  if (typeof type === 'function') {
    type = type(mForm, {
      model: props.model,
    });
  }
  if (type === 'form') return '';
  return type?.replace(/([A-Z])/g, '-$1').toLowerCase() || (items.value ? '' : 'text');
});

const display = computed((): boolean => {
  if (props.config.display === 'expand') {
    return expand.value;
  }

  return displayFunction(mForm, props.config.display, props);
});

const itemLabelWidth = computed(() => props.config.labelWidth || props.labelWidth);

watchEffect(() => {
  expand.value = props.expandMore;
});

const expandHandler = () => (expand.value = !expand.value);

const key = (config: any) => config[mForm?.keyProps];

const filterHandler = (filter: any, value: FormValue | number | string) => {
  if (typeof filter === 'function') {
    return filter(mForm, value, {
      model: props.model,
      values: mForm?.initValues,
      formValue: mForm?.values,
      prop: itemProp.value,
      config: props.config,
    });
  }

  if (filter === 'number') {
    return +value;
  }

  return value;
};

const changeHandler = (onChange: any, value: FormValue | number | string) => {
  if (typeof onChange === 'function') {
    return onChange(mForm, value, {
      model: props.model,
      values: mForm?.initValues,
      formValue: mForm?.values,
      prop: itemProp.value,
      config: props.config,
    });
  }
};

const trimHandler = (trim: any, value: FormValue | number | string) => {
  if (typeof value === 'string' && trim) {
    return value.replace(/^\s*/, '').replace(/\s*$/, '');
  }
};

const onChangeHandler = async function (v: FormValue, key?: string) {
  const { filter, onChange, trim, name, dynamicKey } = props.config as any;
  let value: FormValue | number | string = v;

  try {
    value = filterHandler(filter, v);
    value = (await changeHandler(onChange, value)) ?? value;
    value = trimHandler(trim, value) ?? value;
  } catch (e) {
    console.error(e);
  }

  // field内容下包含field-link时，model===value, 这里避免循环引用
  if ((name || name === 0) && props.model !== value && (v !== value || props.model[name] !== value)) {
    // eslint-disable-next-line vue/no-mutating-props
    props.model[name] = value;
  }
  // 动态表单类型，根据value和key参数，直接修改model
  if (key !== undefined && dynamicKey) {
    // eslint-disable-next-line vue/no-mutating-props
    props.model[key] = value;
  }
  emit('change', props.model);
};
</script>
