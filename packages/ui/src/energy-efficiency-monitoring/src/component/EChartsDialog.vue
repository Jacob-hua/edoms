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
        <el-divider direction="vertical" />
        <span :class="active === 'month' ? 'checked' : ''" @click="handleChangeType('month')">月</span>
        <el-divider direction="vertical" />
        <span :class="active === 'year' ? 'checked' : ''" @click="handleChangeType('year')">年</span>
      </div>
      <div class="chart-container">
        <EdomsCharts :width="width" :height="height" :option="options"></EdomsCharts>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { UnitTime } from '@edoms/utils';

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
  (event: 'typeChange', value: UnitTime): void;
}>();

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value);
  },
});

const active = ref<UnitTime>('day');

const handleChangeType = (type: UnitTime) => {
  active.value = type;
  emit('typeChange', type);
};
</script>

<style lang="scss" scoped>
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
  top: 45px;

  span {
    cursor: pointer;
  }
}

.chart-container {
  padding-top: 10px;
}

.checked {
  color: #499ec9;
}
</style>
