<template>
  <el-dialog v-model="dialogVisible" :width="1000">
    <template #header>
      <!-- <el-icon>
        <DataAnalysis />
      </el-icon> -->
      <span>{{ title }}</span>
    </template>
    <div class="time-select">
      <span>日</span>
      <el-divider direction="vertical" />
      <span>月</span>
      <el-divider direction="vertical" />
      <span>年</span>
    </div>
    <div class="chart-container">
      <EdomsCharts :width="width" :height="height" :option="options"></EdomsCharts>
    </div>
  </el-dialog>
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
</script>

<style lang="scss" scoped>
.time-select {
  position: absolute;
  right: 10%;
  top: 45px;
}

.chart-container {
  padding-top: 10px;
}
</style>
