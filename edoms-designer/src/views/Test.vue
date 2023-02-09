<template>
  <button @click="handleCheck">切换</button>
  <VideoPlayer :src="videos[activeIndex]" type="application/vnd.apple.mpegurl" :muted="true" :playback-rate="2" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import VideoPlayer from '@/components/VideoPlayer.vue';

const videos = [
  'https://gcalic.v.myalicdn.com/gc/ztd_1/index.m3u8?contentid=2820180516001',
  'https://gccncc.v.wscdns.com/gc/wygjt2_1/index.m3u8?contentid=2820180516001',
];

const activeIndex = ref<number>(0);

const handleCheck = () => {
  if (activeIndex.value === 0) {
    activeIndex.value = 1;
  } else {
    activeIndex.value = 0;
  }
};
</script>
