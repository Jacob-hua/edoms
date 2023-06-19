<template>
  <div v-show="props.list.length" class="tab-list">
    <div v-for="itm in props.list" :key="itm.value" class="list-item" :style="{ width: `${100 / props.list.length}%` }">
      <div :class="['itm-key', currentIdx === itm.value ? 'active' : '']" @click="handlerToChange(itm)">
        {{ itm.key }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref, watch, withDefaults } from 'vue';

const props = withDefaults(
  defineProps<{
    list: Array<{ [key: string]: string | number }>;
  }>(),
  {
    list: () => [
      {
        key: '日',
        value: 'day',
      },
      {
        key: '月',
        value: 'month',
      },
      {
        key: '年',
        value: 'year',
      },
    ],
  }
);

const emits = defineEmits<{
  (e: 'operate', itm: { [key: string]: any }): void;
}>();

const currentIdx = ref<string | number>('0');

const handlerToChange = (itm: { [key: string]: any }) => {
  currentIdx.value = itm.value;
  emits('operate', itm);
};

onBeforeMount(() => {
  currentIdx.value = props.list[0]?.value;
});

watch(
  () => props.list,
  (newV: Array<{ [key: string]: string | number }>) => {
    currentIdx.value = newV[0]?.value;
  }
);
</script>

<style lang="scss" scoped>
.tab-list {
  width: 100%;
  height: 34px;
  margin: 10px 0;
  pointer-events: all;
  // background-color: antiquewhite;
  display: flex;
  justify-content: space-between;
  padding: 5px 0px;
  box-sizing: border-box;
  border-top: 1px solid rgba(0, 163, 255, 0.3);
  border-bottom: 1px solid rgba(0, 163, 255, 0.3);
  overflow: hidden;
  clear: both;
  .list-item {
    height: 22px;
    border-left: 1px solid rgba(0, 163, 255, 0.3);
    &:last-child {
      border-right: 1px solid rgba(0, 163, 255, 0.3);
    }
    .itm-key {
      width: 92px;
      height: 22px;
      background-color: rgba(0, 163, 255, 0.1);
      text-align: center;
      line-height: 22px;
      margin: 0 auto;
      cursor: pointer;
      color: rgba(196, 229, 248, 1);
      font-size: 14px;
      box-sizing: border-box;
      &.active {
        color: #fff;
        border: 1px solid rgba(0, 163, 255, 1);
      }
    }
  }
}
</style>
