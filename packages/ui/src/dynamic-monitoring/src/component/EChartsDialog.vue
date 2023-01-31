<template>
  <div>
    <el-dialog v-model="dialogVisible" :width="1000">
      <template #header>
        <!-- <el-icon>
        <DataAnalysis />
      </el-icon> -->
        <span>{{ title }}</span>
      </template>
      <div class="time-select">
        <el-date-picker
          v-model="pickerDate"
          :editable="false"
          :default-value="new Date()"
          popper-class="datePickerDark"
        ></el-date-picker>
      </div>
      <div class="chart-container">
        <EdomsCharts :width="width" :height="height" :option="options"></EdomsCharts>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
// import { DataAnalysis } from '@element-plus/icons-vue';

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
}>();

const pickerDate = ref<string>('');

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

onUnmounted(() => {});
</script>

<style lang="scss" scoped>
:root {
  --el-bg-color-overlay: #000000;
}
:deep(.el-dialog__header) {
  background-color: rgba(31, 30, 29, 1);
  margin: 0;
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

.datePickerDark :deep(.el-popper) {
  background: #000000;
  border: 1px solid #000000;
}
</style>
<!-- <style lang="scss">
.datePickerDark {

  background: #000000;
  border: 1px solid #000000;

  .el-picker-panel {
    color: #CFD3DC;
    background: #000000;
  }
}
</style> -->
