<template>
  <div class="wrap-select">
    <div class="wrap-value" @click="showOption = !showOption">
      <div class="value">{{ value }}</div>
      <div class="arrow" :class="{ active: showOption }"></div>
    </div>
    <div v-if="showOption" class="wrap-option">
      <div v-for="(item, index) in options" :key="index" class="list">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

withDefaults(
  defineProps<{
    width?: string | number;
    height?: string | number;
    options?: Array<{ [key: string]: string | number }>;
    itemHeight?: string | number;
    value?: string | number;
  }>(),
  {
    width: () => '100%',
    height: () => '32px',
  }
);

const showOption = ref<boolean>(false);
</script>

<style lang="scss" scoped>
.wrap-select {
  position: relative;
  width: 100%;
  height: v-bind(height);
  background: #030507;
  border: 1px solid #454e72;
  border-radius: 4px;
  .wrap-value {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .value {
      padding-left: 10px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
    }
    .arrow {
      padding-right: 10px;
      background: url('../../assets/image/arrow_up.png');
      background-size: 100% 100%;
      &.active {
        background: url('../../assets/image/arrow_down.png');
      }
    }
  }
  .wrap-option {
    position: absolute;
    margin-top: 5px;
    width: 100%;
    height: 96px;
    background-color: rgba(9, 15, 23, 1);
    // background: #030507;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 99;
    .list {
      width: 100%;
      height: 32px;
      display: flex;
      padding-left: 10px;
      align-items: center;
      color: #ffffff;
      &:hover {
        background-color: green;
      }
    }
  }
}
</style>
