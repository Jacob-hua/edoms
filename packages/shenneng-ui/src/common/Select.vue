<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-05-12 16:36:57
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-16 10:03:16
-->
<template>
  <div class="wrap-select" :style="`width:${width}px;`">
    <div class="wrap-value" @click="showOption = !showOption">
      <div class="value">{{ label || '请选择' }}</div>
      <div class="arrow" :class="{ active: showOption }"></div>
    </div>
    <div v-if="showOption" class="wrap-option">
      <div
        v-for="(item, index) in options"
        :key="index"
        class="list"
        :class="{ active: activeIndex === index }"
        @click="changeSelect(item, index)"
      >
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
const activeIndex = ref<number>(-1);
const label = ref<string | number>('');

const emit = defineEmits(['changeItem']);

// const closeTable = () => {
//   emit('closeTable');
// };
const changeSelect = (item: any, index: number) => {
  if (activeIndex.value === index) return;
  activeIndex.value = index;
  showOption.value = false;
  label.value = item.label;
  emit('changeItem', item.value);
};
</script>

<style lang="scss" scoped>
.wrap-select {
  position: relative;
  width: 100%;
  height: v-bind(height);
  background: #030507;
  border: 1px solid #454e72;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  .wrap-value {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .value {
      padding-left: 10px;
      font-family: Microsoft YaHei;
    }
    .arrow {
      width: 10px;
      height: 10px;
      margin-right: 10px;
      background: url('../../assets/image/arrow_down.png');
      background-size: 100% 100%;
      &.active {
        background: url('../../assets/image/arrow_up.png');
        background-size: 100% 100%;
      }
    }
  }
  .wrap-option {
    position: absolute;
    margin-top: 5px;
    width: 100%;
    height: 120px;
    background-color: #1f2734;
    border-radius: 4px;
    // background: #030507;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 99;
    .list {
      width: 100%;
      height: 40px;
      display: flex;
      padding-left: 10px;
      align-items: center;
      color: #ffffff;
      &:hover,
      &.active {
        background-color: #2c3647;
      }
    }
  }
}
</style>
