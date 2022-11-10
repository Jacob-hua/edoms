<template>
  <div class="m-fields-group-list-item">
    <div class="reference">
      <ElIcon style="margin-right: 7px" @click="expandHandler"
        ><CaretBottom v-if="expand" /><CaretRight v-else
      /></ElIcon>

      <ElButton text @click="expandHandler">{{ title }}</ElButton>

      <div>
        <ElButton
          v-show="showDelete(parseInt(String(index)))"
          text
          :icon="Delete"
          style="color: #f56c6c"
          @click="removeHandler"
        ></ElButton>

        <template v-if="movable()">
          <ElButton v-show="index !== 0" text size="small" @click="changeOrder(-1)"
            >上移<ElIcon><CaretTop /></ElIcon
          ></ElButton>
          <ElButton v-show="index !== length - 1" text size="small" @click="changeOrder(1)"
            >下移<ElIcon><CaretBottom /></ElIcon
          ></ElButton>
        </template>
      </div>

      <span v-if="itemExtra" class="m-form-tip" v-html="itemExtra"></span>
    </div>

    <Container
      v-if="expand"
      :config="rowConfig"
      :model="model"
      :label-width="labelWidth"
      :prop="`${prop}${prop ? '.' : ''}${String(index)}`"
      :size="size"
      @change="changeHandler"
    ></Container>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue';
import { CaretBottom, CaretRight, CaretTop, Delete } from '@element-plus/icons-vue';

import { ElButton, ElIcon } from '@edoms/design';

import { FormState, GroupListConfig } from '../schema';
import { filterFunction } from '../utils/form';

import Container from './Container.vue';

const props = defineProps<{
  model: any;
  groupModel: any[];
  config: GroupListConfig;
  labelWidth?: string;
  prop?: string;
  size?: string;
  index: number;
}>();

const emit = defineEmits(['swap-item', 'remove-item', 'change']);

const mForm = inject<FormState | undefined>('mForm');
const expand = ref(false);

watchEffect(() => {
  expand.value = !props.index;
});

const rowConfig = computed(() => ({
  type: 'row',
  span: props.config.span || 24,
  items: props.config.items,
  labelWidth: props.config.labelWidth,
  [mForm?.keyProp || '__key']: `${props.config[mForm?.keyProp || '__key']}${String(props.index)}`,
}));

const title = computed(() => {
  const titleFunc = props.config.title;
  const titleKey = props.config.titleKey;
  if (typeof titleFunc === 'function') {
    return titleFunc(props.model, props.index, mForm?.values);
  }
  if (titleKey && props.model[titleKey]) {
    return props.model[titleKey];
  }
  return `组 ${String(props.index)}`;
});

const length = computed(() => props.groupModel?.length || 0);

const itemExtra = computed(() => filterFunction(mForm, props.config.itemExtra, props));

const removeHandler = () => emit('remove-item', props.index);

const changeHandler = () => emit('change');

const expandHandler = () => {
  expand.value = !expand.value;
};

// 希望支持单行可控制是否显示删除按钮，不会影响现有逻辑
const showDelete = (index: number) => {
  const deletableFunc = props.config.deletable;
  if (deletableFunc === undefined) {
    return true;
  }
  if (deletableFunc && typeof deletableFunc === 'function') {
    return deletableFunc(props.model, index, mForm?.values);
  }
  return deletableFunc;
};

// 调换顺序
const changeOrder = (offset = 0) => emit('swap-item', props.index, `${String(props.index)}${offset}`);

const movable = () => {
  const { movable } = props.config;

  // 没有设置时，默认可移动
  if (movable === undefined) return true;
  if (typeof movable === 'function') {
    return movable(mForm, props.index || 0, props.model, props.groupModel);
  }
  return movable;
};
</script>
