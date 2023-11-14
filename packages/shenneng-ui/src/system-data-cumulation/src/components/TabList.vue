<template>
  <div v-show="currentList.length" class="tab-list">
    <div
      v-for="itm in currentList"
      :key="itm.value"
      class="list-item"
      :style="{ width: `${100 / currentList.length}%` }"
    >
      <div :class="['itm-key', currentIdx === itm.value ? 'active' : '']" @click="handlerToChange(itm)">
        {{ itm.key }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';

import useI18n from '../../../useI18n';
const { t } = useI18n();
const list: Array<{ [key: string]: string }> = [
  {
    key: t('日'),
    value: 'd',
  },
  {
    key: t('月'),
    value: 'm',
  },
  {
    key: t('年'),
    value: 'y',
  },
];

const props = defineProps<{
  tabData: Array<string>;
}>();

const emits = defineEmits<{
  (e: 'operate', itm: { [key: string]: any }): void;
}>();

const currentIdx = ref<string | number>('0');

const currentList = computed(() => {
  return props.tabData?.map((item) => {
    const foundKey = list.find(({ value }) => value == item)?.key;
    return { key: foundKey, value: item };
  });
});

const handlerToChange = (itm: { [key: string]: any }) => {
  currentIdx.value = itm.value;
  emits('operate', itm);
};

onBeforeMount(() => {
  currentIdx.value = props.tabData[0];
});
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
