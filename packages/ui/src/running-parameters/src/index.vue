<template>
  <BusinessCard title="运行参数" min-width="1080" min-height="240">
    <template #operation>
      <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleTriggerTab">
        <el-tab-pane label="系统曲线" name="first" />
        <el-tab-pane label="设备曲线" name="second" />
      </el-tabs>
    </template>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import BusinessCard from '../../BusinessCard.vue';

import { MRunningParameters } from './type';

defineProps<{
  config: MRunningParameters;
}>();

const activeTab = ref<string>('');

const handleTriggerTab = () => {};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0;
}
::v-deep .el-tabs__item {
  color: #fff;
}
::v-deep .el-tabs__item.is-active {
  color: #e99a3c;
}
::v-deep .el-tabs__active-bar {
  background-color: #e99a3c;
}
::v-deep .el-tabs__nav-wrap::after {
  background-color: transparent;
}
</style>
