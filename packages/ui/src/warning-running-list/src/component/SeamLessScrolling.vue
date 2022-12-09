<!--无缝滚动组件-->
<template>
  <div class="list-container">
    <div id="carList" :class="[config.isScroll ? 'animate' : 'marquee']">
      <slot v-for="(item, index) in data" :key="index" :item="item"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, Ref, toRefs } from 'vue';

import { MConfig } from '../index.vue';

const props = defineProps<{
  dataSource: any[];
}>();
const { dataSource: data } = toRefs(props);
const config = inject<Ref<MConfig>>('config');
const speed = computed(() => `${config?.value?.speed}s`);
onMounted(() => {
  data.value = data.value?.concat(props.dataSource);
});
</script>

<style lang="scss" scoped>
.list-container {
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}
.animate {
  animation: marquee v-bind(speed) linear infinite;
}
//无限滚动
.marquee {
  animation-delay: -5s;
}
.marquee:hover {
  animation-play-state: paused;
}
@keyframes marquee {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-51%); //这里不是-100%！
  }
}
</style>
