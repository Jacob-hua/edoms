<template>
  <div class="block">
    <el-date-picker v-model="value1" :teleported="false" :type="timeType.option" @change="selectDate" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const emit = defineEmits<{
  (event: 'ctTime', time: Record<string, any>): void;
}>();
const timeType = defineProps<{
  option: any;
}>();
const value1 = ref(new Date());
const selectDate = (time: Record<string, any>) => {
  console.log(time.getDate());
  if (timeType.option !== 'date') {
    return;
  }
  emit('ctTime', time);
};

const setDefultTime = () => {
  value1.value = new Date('2023-05-15 00:00:00');
};
defineExpose({
  setDefultTime,
});
</script>

<style lang="scss" scoped>
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper-input) {
  width: 137px;
  height: 32px;
  z-index: 999;
}

:deep(.el-input__wrapper) {
  padding-right: 30px;
  position: relative;
  box-shadow: none;
  background-color: #030507;
}

:deep(.el-input__prefix) {
  position: absolute;
  right: 0px;
}

:deep(.el-date-table td.current:not(.disabled) .el-date-table-cell__text) {
  color: #030507 !important;
}

.block {
  text-align: center;
  margin-left: 30px;
}
</style>
