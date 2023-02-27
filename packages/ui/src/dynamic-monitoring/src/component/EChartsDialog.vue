<template>
  <div>
    <el-dialog v-model="dialogVisible" :width="1000">
      <template #header>
        <span>{{ title }}</span>
      </template>
      <div class="time-select">
        <el-date-picker
          v-model="pickerDate"
          :editable="false"
          popper-class="datePickerDark"
          :append-to-body="false"
        ></el-date-picker>
      </div>
      <div class="chart-container">
        <EdomsCharts
          :width="width"
          :height="height"
          :option="options"
          @magictype-chang="handleChangeMagictype"
        ></EdomsCharts>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatDate } from '@edoms/utils';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';

const props = withDefaults(
  defineProps<{
    title: string;
    width: number;
    height: number;
    options: ECOption;
    visible: boolean;
  }>(),
  {}
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'dateChange', value: string): void;
  (event: 'magictypeChange', value: string): void;
}>();

const pickerDate = ref<string>(formatDate(new Date(), 'YYYY-MM-DD'));
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value);
  },
});

watch(
  () => pickerDate.value,
  (value) => {
    emit('dateChange', value);
  }
);

const handleChangeMagictype = (value: string) => {
  emit('magictypeChange', value);
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
  background-color: rgba(31, 30, 29, 1);
  margin: 0;
  min-height: 14px;
}

:deep(.el-dialog__header span) {
  color: #ffffff85;
}

:deep(.el-dialog__body) {
  background-color: #000000;
}

.time-select {
  position: absolute;
  right: 10%;
  top: 50px;

  :deep(.el-input__wrapper) {
    background-color: #000000;
  }
}

.chart-container {
  padding-top: 10px;
}
</style>

<style lang="scss">
.datePickerDark {
  background: rgba(31, 30, 29, 1) !important;
  border: 1px solid rgba(31, 30, 29, 1) !important;

  .el-picker-panel {
    color: #cfd3dc;
    background: rgba(31, 30, 29, 1);
  }

  .el-popper__arrow {
    border-bottom-color: rgba(31, 30, 29, 1) !important;
  }
  .el-popper__arrow::before {
    border-bottom-color: rgba(31, 30, 29, 1) !important;
  }
}
</style>
