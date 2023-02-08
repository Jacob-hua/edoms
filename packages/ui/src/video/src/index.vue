<template>
  <BusinessCard title="视频监控" min-width="1080" min-height="790">
    <div class="warpper">
      <el-tabs v-model="activeCamera" class="camera-tabs">
        <el-tab-pane
          v-for="(camera, index) in cameras"
          :key="index"
          :label="camera.cameraName"
          :name="`${index}`"
        ></el-tab-pane>
      </el-tabs>
      <!-- <video src=""></video> -->
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import BusinessCard from '../../BusinessCard.vue';

import { VideoConfigs } from './type';

const props = defineProps<{
  configs: VideoConfigs;
}>();

const activeCamera = ref<number>(-1);

const cameras = computed<VideoConfigs>(() => props.configs);
</script>

<style lang="scss" scoped></style>
