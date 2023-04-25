<template>
  <div ref="wrapper" class="business-wrapper">
    <div class="business-wrapper-header">
      <img class="icon-left" src="../assets/image/icon_left.png" alt="" />
      <img class="icon-bg" src="../assets/image/bg_icon.png" alt="" />
      <div class="title-wrapper">
        <span class="title">{{ title }}</span>
        <span class="subtitle">{{ subtitle }}</span>
      </div>
      <div class="operation-wrapper">
        <slot name="operation"></slot>
      </div>
    </div>
    <div class="business-wrapper-body">
      <slot></slot>
      <Bottom />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { isNumber } from '@edoms/utils';

import Bottom from './common/Bottom.vue';

const props = defineProps<{
  title?: string;
  subtitle?: string;
  minWidth?: string | number;
  minHeight?: string | number;
}>();

const wrapper = ref<HTMLElement | null>(null);

const minWidth = computed<number | undefined>(() => {
  if (typeof props.minWidth === 'number') {
    return props.minWidth;
  }
  if (typeof props.minWidth === 'string' && isNumber(props.minWidth)) {
    return Number(props.minWidth);
  }
  return undefined;
});

const cssMinWidth = computed<string>(() => (minWidth.value ? `${minWidth.value}px` : 'auto'));

const minHeight = computed<number | undefined>(() => {
  if (typeof props.minHeight === 'number') {
    return props.minHeight;
  }
  if (typeof props.minHeight === 'string' && isNumber(props.minHeight)) {
    return Number(props.minHeight);
  }
  return undefined;
});

const cssMinHeight = computed<string>(() => (minHeight.value ? `${minHeight.value}px` : 'auto'));
</script>

<style lang="scss">
.business-wrapper {
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  background-color: rgba(31, 30, 29, 1);
  min-width: v-bind(cssMinWidth);
  min-height: v-bind(cssMinHeight);
  width: inherit;
  height: inherit;
  color: #ffffff85;
}
.business-wrapper-header {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  //   justify-content: space-between;
  padding: 2px 16px 0 0;
  background-image: url(../assets/image/bg_card.png);
  background-size: 100% 100%;
  height: 41px;
  .icon-left {
    width: 5px;
    height: 23px;
    margin-right: 7px;
  }
  .icon-bg {
    width: 23px;
    height: 18px;
    margin-right: 14px;
  }
  //   background-color: red;

  & > .title-wrapper {
    display: flex;
    align-items: center;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff85;
      margin-right: 19px;
    }

    .subtitle {
      color: #ffffff45;
      font-size: 10px;
    }
  }

  & > .operation-wrapper {
    cursor: pointer;
  }
}
.business-wrapper-body {
  //   background-color: red;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  border-bottom: 1px solid rgba($color: #215898, $alpha: 0.5);
  //   align-items: center;
  //   padding: 0 16px;
}
</style>
