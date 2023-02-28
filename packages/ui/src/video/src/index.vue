<template>
  <BusinessCard title="视频监控" subtitle="VIDEO" min-width="392" min-height="320">
    <div class="wrapper">
      <el-tabs v-model="activeCamera">
        <el-tab-pane v-for="(camera, index) in cameras" :key="index" :label="camera.cameraName" :name="index" />
      </el-tabs>
      <VideoPlayer
        :src="videoSource"
        type="application/vnd.apple.mpegurl"
        :controls="false"
        :muted="true"
        :playback-rate="2"
      />
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

const activeCamera = ref(0);

const videoSource = ref<string>('');

const cameras = computed<CameraItem[]>(() => props.config?.cameras ?? []);

watch(
  () => activeCamera.value,
  (activeCamera) => {
    if (cameras.value.length <= 0) return;
    const targetCamera = cameras.value.at(activeCamera);
    videoSource.value = targetCamera?.videoSource ?? '';
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}

:deep(.el-tabs) {
  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__nav-wrap::after {
    background-color: #ffffff25;
  }

  .is-scrollable {
    .el-tabs__item {
      width: 80px;
    }
  }
  .el-tabs__item {
    width: 90px;
    text-align: center;
    color: #ffffff45;
  }

  .el-tabs__active-bar {
    background-color: #e99a3c;
  }

  .is-active {
    color: #e99a3c;
  }
}
:deep(.business-wrapper-body) {
  align-items: flex-start;
}
</style>
