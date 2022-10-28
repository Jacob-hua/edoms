<template>
  <div class="edoms-editor-nav-menu">
    <el-button
      v-for="(item, index) in data"
      :key="index"
      class="menu-item button"
      size="small"
      text
      @click="item.handler"
    >
      <el-icon><component :is="item.icon"></component></el-icon><span>{{ item.text }}</span>
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { MenuButton } from '@edoms/editor';

export default defineComponent({
  name: 'NavMenu',

  props: {
    data: {
      type: Array as PropType<MenuButton[]>,
      default: () => [],
    },
  },
});
</script>

<style lang="scss">
.edoms-editor-nav-menu {
  justify-content: flex-end;
  height: 35px;
}
</style>
