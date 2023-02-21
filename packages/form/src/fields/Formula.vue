<template>
  <div class="formula-container">
    <el-header>
      <div v-for="(menu, index) in config.options" :key="index" class="menu-item">
        <el-dropdown @command="handleCommand">
          <span>{{ menu.label }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="({ label, value }, index) in menu.value" :key="index" :command="value">{{
                label
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-main>
      <ElInput
        v-model="textValue"
        type="textarea"
        :size="size"
        clearable
        :placeholder="config.placeholder"
        :disabled="disabled"
        @change="changeHandler"
        @input="inputHandler"
      ></ElInput>
    </el-main>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';

import { ElInput } from '@edoms/design';

import { FormState, FormulaConfig } from '../schema';
import { useAddField } from '../utils/useAddField';

const props = defineProps<{
  config: FormulaConfig;
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

const mForm = inject<FormState | null>('mForm');

const textValue = ref(props.name[props.model]);

const changeHandler = (value: number) => {
  console.log(value, 'ffff');

  emit('change', value);
};

const inputHandler = (v: string) => {
  emit('input', v);
  mForm?.$emit('field-input', props.prop, v);
};

const handleCommand = (command: string) => {
  if (textValue.value) {
    textValue.value += command;
  } else {
    textValue.value = command;
  }
};
</script>

<style lang="scss" scoped>
.formula-container {
  width: 99%;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6;
  box-sizing: border-box;
}

:deep(.el-header) {
  display: flex;
  justify-content: space-around;
  padding: 5px;
  border-bottom: 1px solid #dcdfe6;
  height: fit-content;
}

:deep(.el-textarea__inner) {
  box-shadow: none;
}
:deep(.el-main) {
  padding: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
