<template>
  <BusinessCard title="视频监控" min-width="800" min-height="500">
    <div class="warpper">
      <el-tabs v-model="activeCamera" class="camera-tabs">
        <el-tab-pane v-for="(camera, index) in cameras" :key="index" :label="camera.cameraName" :name="`${index}`" />
      </el-tabs>
      <VideoPlayer :src="videoSource" type="application/vnd.apple.mpegurl" :muted="true" :playback-rate="2" />
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import BusinessCard from '../../BusinessCard.vue';

import VideoPlayer from './component/VideoPlayer.vue';
import { CameraItem, VideoConfigs } from './type';

const props = defineProps<{
  config: VideoConfigs;
}>();

const activeCamera = ref<string>('0');

const videoSource = ref<string>('');

const cameras = computed<CameraItem[]>(() => props.config?.cameras ?? []);

watch(
  () => activeCamera.value,
  (activeCamera) => {
    if (cameras.value.length <= 0) return;
    const targetCamera = cameras.value.at(Number(activeCamera));
    videoSource.value = targetCamera?.videoSource ?? '';
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.warpper {
  width: 100%;
}
</style>
