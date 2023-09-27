<template>
  <div v-show="list.length" class="tab-list">
    <div v-for="itm in list" :key="itm.value" class="list-item" :style="{ width: `${100 / list.length}%` }">
      <div :class="['itm-key', currentIdx === itm.value ? 'active' : '']" @click="handlerToChange(itm)">
        {{ itm.key }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';

import useI18n from '../../../useI18n';
const { t } = useI18n();
const list: Array<{ [key: string]: string | number }> = [
  {
    key: t('日'),
    value: 'day',
  },
  {
    key: t('月'),
    value: 'month',
  },
  {
    key: t('年'),
    value: 'year',
  },
];
const emits = defineEmits<{
  (e: 'operate', itm: { [key: string]: any }): void;
}>();

const currentIdx = ref<string | number>('0');

const handlerToChange = (itm: { [key: string]: any }) => {
  currentIdx.value = itm.value;
  emits('operate', itm);
};

onBeforeMount(() => {
  currentIdx.value = list[0]?.value;
});

watch(
  () => list,
  (newV: Array<{ [key: string]: string | number }>) => {
    currentIdx.value = newV[0]?.value;
  }
);
</script>

<style lang="scss" scoped>
.tab-list {
  display: flex;
  align-items: center;
  .list-item {
    margin: 0 10px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 14px;
    cursor: pointer;
  }
  .active {
    color: rgb(46, 176, 255);
  }
}
</style>
