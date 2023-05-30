<template>
  <div class="block">
    <el-date-picker v-model="value1" :type="timeType.option" @change="selectDate" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const timeType = defineProps<{
  option: any;
}>();
const value1 = ref(new Date('2023-03-17 00:00:00'));
const selectDate = (time: Record<string, any>) => {
  console.log(time.getDate());
};
</script>

<style lang="scss" scoped>
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper-input) {
  width: 200px;
  height: 32px;
  z-index: 999;
}

:deep(.el-input__wrapper) {
  padding-right: 30px;
  position: relative;
  background-color: #030507;
  border: 1px solid #454e72;
  box-shadow: none;
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
