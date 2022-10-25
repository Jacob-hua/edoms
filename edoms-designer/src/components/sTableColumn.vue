<template>
  <el-table-column v-bind="attrs"> </el-table-column>
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue';
const attrs = useAttrs();
</script>

<style lang="scss" scoped></style>
