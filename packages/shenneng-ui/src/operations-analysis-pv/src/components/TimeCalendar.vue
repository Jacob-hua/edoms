<template>
  <div class="block">
    <el-date-picker v-model="value1" :type="timeType.option" @change="selectDate" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const timeType = defineProps<{
  option: string;
}>();
const value1 = ref(new Date());
const selectDate = () => {
  console.log(value1);
};
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
