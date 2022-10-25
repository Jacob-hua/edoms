<template>
  <el-popover placement="bottom" trigger="click">
    <div v-for="({ iconSize, iconColor, icon, name, action }, index) in menus" :key="index" class="plane-menu">
      <div class="inner-box" @click="action">
        <el-icon :size="iconSize" :color="iconColor">
          <component :is="icon" />
        </el-icon>
        <span :style="{ color: iconColor }">{{ name }}</span>
      </div>
    </div>
    <template #reference>
      <el-icon :size="28" color="#fff">
        <slot name="iconSlot"></slot>
      </el-icon>
    </template>
  </el-popover>
</template>

<script lang="ts" setup name="PopoverMenu">
import { Menu } from './type';
withDefaults(
  defineProps<{
    menus: Array<Menu>;
  }>(),
  {
    menus: () => [],
  }
);
</script>

<style lang="scss" scoped>
.el-icon {
  cursor: pointer;
}
.plane-menu {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #333;
  padding: 10px 0;
  span {
    margin-left: 10px;
  }
  .inner-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
