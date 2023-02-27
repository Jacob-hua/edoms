<template>
  <div>
    <el-dialog v-model="dialogVisible" :width="1000">
      <template #header>
        <span>{{ title }}</span>
      </template>
      <div class="time-select">
        <span :class="active === 'day' ? 'checked' : ''" @click="handleChangeType('day')">日</span>
        <span :class="active === 'month' ? 'checked' : ''" @click="handleChangeType('month')">月</span>
        <span :class="active === 'year' ? 'checked' : ''" @click="handleChangeType('year')">年</span>
      </div>
      <EdomsCharts class="chart-container" :option="options"></EdomsCharts>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { UnitTime } from '@edoms/utils';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';

const props = withDefaults(
  defineProps<{
    title: string;
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
    right: 10%;
    text-align: right;
    margin-left: 10px;
  }
}

.chart-container {
  padding-top: 10px;
  width: 960px;
  height: 480px;
}

.checked {
  color: #499ec9;
}
</style>
