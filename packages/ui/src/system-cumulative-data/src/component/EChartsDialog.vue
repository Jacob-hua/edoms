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
        <span :class="active === 'day' ? 'checked' : ''" @click="handleChangeType('day')">日</span>
        <span :class="active === 'month' ? 'checked' : ''" @click="handleChangeType('month')">月</span>
        <span :class="active === 'year' ? 'checked' : ''" @click="handleChangeType('year')">年</span>
      </div>
      <div class="chart-container">
        <EdomsCharts :width="width" :height="height" :option="options"></EdomsCharts>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

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
    dateRange: string;
  }>(),
  {}
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'typeChange', value: string): void;
}>();

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value);
  },
});

const active = ref<string>('day');

const handleChangeType = (type: string) => {
  active.value = type;
  emit('typeChange', type);
};

watch(
  () => props.dateRange,
  (val) => (active.value = val)
);
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
  text-align: right;

  span {
    cursor: pointer;
    position: relative;
    text-align: right;
    right: 10%;
    margin-left: 10px;
  }
}

.chart-container {
  padding-top: 10px;
}

.checked {
  color: #499ec9;
}
</style>
