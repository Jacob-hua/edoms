<template>
  <el-container class="container">
    <el-header class="header">Header</el-header>
    <el-container>
      <el-aside class="aside">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
export default {
  name: 'LayoutVue',
}
</script>

<script lang="ts" setup></script>

<style scoped lang="scss">
$header-bg-color: aqua;
$aside-bg-color: aquamarine;

.container {
  height: 100%;

  .header {
    background-color: $header-bg-color;
  }

  .aside {
    background-color: $aside-bg-color;
  }
}
</style>
