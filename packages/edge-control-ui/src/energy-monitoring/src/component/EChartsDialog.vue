<template>
  <div>
    <el-dialog v-model="dialogVisible" :width="1400" :height="660">
      <template #header>
        <span>{{ title }}</span>
      </template>
      <div class="time-select">
        <span :class="active === 'day' ? 'checked' : ''" @click="handleChangeType('day')">日</span>
        <span :class="active === 'month' ? 'checked' : ''" @click="handleChangeType('month')">月</span>
        <span :class="active === 'year' ? 'checked' : ''" @click="handleChangeType('year')">年</span>
      </div>
      <EdomsCharts class="chart-container" :option="options" @magictype-chang="handleChangeMagictype"></EdomsCharts>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { UnitTime } from '@edoms/utils';

import EdomsCharts from '../../../EdomsCharts.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    options: any;
    visible: boolean;
  }>(),
  {}
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'typeChange', value: UnitTime): void;
  (event: 'magictypeChange', value: string): void;
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

const handleChangeMagictype = (value: string) => {
  emit('magictypeChange', value);
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
  background-color: #333c50;
  margin: 0;
  min-height: 14px;
  padding-bottom: 15px;
}
:deep(.el-dialog__header span) {
  color: #ffffff85;
}
:deep(.el-dialog__headerbtn) {
  top: 0;
}
:deep(.el-dialog__body) {
  background-color: #272d36;
}
.time-select {
  text-align: right;
  span {
    cursor: pointer;
    position: relative;
    right: 4%;
    text-align: right;
    margin: 0 20px;
  }
}

.chart-container {
  padding-top: 10px;
  width: 1360px;
  height: 570px;
}

.checked {
  color: #499ec9;
}
</style>
