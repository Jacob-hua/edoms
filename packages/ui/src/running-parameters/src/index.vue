<template>
  <BusinessCard title="运行参数" min-width="480" min-height="200">
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
