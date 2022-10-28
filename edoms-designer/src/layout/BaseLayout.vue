<template>
  <el-container class="container">
    <el-header class="header">
      <slot name="header"></slot>
    </el-header>
    <el-main>
      <slot></slot>
    </el-main>
  </el-container>
</template>

<script lang="ts">
export default {
  name: 'BaseLayout',
};
</script>

<script lang="ts" setup></script>

<style scoped lang="scss">
$header-bg-color: #21202e;

.container {
  height: 100%;

  .header {
    background-color: $header-bg-color;
  }
}

.el-main {
  margin: 0;
  padding: 0;
}
</style>
