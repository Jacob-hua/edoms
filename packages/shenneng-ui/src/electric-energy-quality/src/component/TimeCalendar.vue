<template>
  <div class="block">
    <el-date-picker v-model="value1" type="date" />
  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue';

// const value1 = ref('');
const value1 = new Date();
</script>

<style lang="scss" scoped>
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper-input) {
  width: 137px;
  height: 32px;
  z-index: 999;
}

:deep(.el-input__wrapper) {
  background-color: #030507;
}

.block {
  padding-top: 25px;
  text-align: center;
  flex: 1;
}
</style>
