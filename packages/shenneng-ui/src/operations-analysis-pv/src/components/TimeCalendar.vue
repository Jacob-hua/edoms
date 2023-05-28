<template>
  <div class="block">
    <el-date-picker
      v-model="value1"
      :type="timeType.option.type"
      :disabled-date="disabledDateFun"
      @change="selectDate"
    />
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
const value1 = ref(new Date('2023-05-15 00:00:00'));
const selectDate = (time: Record<string, any>) => {
  console.log(time.getDate());
  if (timeType.option.type !== 'date') {
    return;
  }
  emit('ctTime', time);
};
const disabledDateFun = (time: Record<string, any>): boolean => {
  if (
    time.getTime() < new Date('2023-05-21 00:00:00').getTime() &&
    time.getTime() > new Date('2023-05-14 00:00:00').getTime()
  ) {
    return false;
  } else {
    return true;
  }
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
  background-color: #030507;
}

:deep(.el-input__prefix) {
  position: absolute;
  right: 0px;
}
:deep(.el-input__inner) {
  color: #ffffff;
}
.block {
  text-align: center;
}
</style>
