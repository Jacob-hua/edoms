<!--无缝滚动组件-->
<template>
  <div class="list-container">
    <div id="carList" :class="[config.isScroll ? 'marquee' : '']">
      <slot v-for="(item, index) in data" :key="index" :item="item"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, Ref, toRefs } from 'vue';

import { MConfig } from '../index.vue';

const props = defineProps<{
  dataSource: any[];
}>();
const { dataSource: data } = toRefs(props);
const config = inject<Ref<MConfig>>('config');
</script>

<style lang="scss" scoped>
.list-container {
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}
</style>
