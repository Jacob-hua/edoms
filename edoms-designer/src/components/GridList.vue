<template>
  <div v-if="isAlive" class="infinite-list-wrapper" style="overflow: auto">
    <div v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled" :infinite-scroll-distance="10">
      <div v-permission="ApplicationPermission.APPLICATION_DESIGN_ADD"><slot name="operation"></slot></div>
      <div v-for="(item, index) in data" :key="index" @click="handleSelectChange(item)">
        <slot :item="item" :index="index">
          {{ item }}
        </slot>
      </div>
      <slot v-if="!loading && data.length === 0" name="empty">
        <p>No Data</p>
      </slot>
    </div>
    <slot v-if="loading" name="loading">
      <p>Loading...</p>
    </slot>
    <slot v-if="noMore && data.length > 0" name="noMore">
      <p class="no-more-text">No More</p>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, shallowRef, watch } from 'vue';

import { deepClone } from '@edoms/utils';

import { ApplicationPermission } from '@/const/permission';

export interface Pagination {
  pageSize: number;
  current: number;
}

export interface RequestResult<T> {
  data: T[];
  total: number;
}

export type RequestFunc<T> = (pagination: Pagination) => Promise<RequestResult<T>> | RequestResult<T>;

const props = withDefaults(
  defineProps<{
    dataSource?: any[];
    pageSize?: number;
    request?: RequestFunc<any>;
    itemMinWidth?: string;
    rowGap?: string;
    columnGap?: string;
  }>(),
  {
    dataSource: () => [],
    pageSize: () => 5,
    request: () => ({
      data: [],
      total: 0,
    }),
    itemMinWidth: () => '200px',
    rowGap: () => '0px',
    columnGap: () => '0px',
  }
);

const emit = defineEmits<{
  (event: 'loaded'): void;
  (event: 'onSelectChange', value: any): void;
}>();

const isAlive = ref(true);
const loading = ref(false);
const noMore = ref(false);
const data = shallowRef();
const total = ref(0);
const current = ref(1);
const disabled = computed(() => loading.value || noMore.value);

watch(
  () => props.dataSource,
  (dataSource) => {
    data.value = deepClone(dataSource);
  },
  { immediate: true }
);

const reload = () => {
  isAlive.value = false;
  nextTick(() => {
    isAlive.value = true;
    data.value = deepClone(props.dataSource);
    total.value = 0;
    current.value = 1;
    noMore.value = false;
    load();
  });
};

const load = async () => {
  loading.value = true;
  const result = await Promise.resolve(
    props.request({
      pageSize: props.pageSize,
      current: current.value,
    })
  );
  loading.value = false;
  total.value = result.total;
  if (result.total === 0 || result.data.length < props.pageSize) {
    noMore.value = true;
  } else {
    current.value += 1;
  }
  data.value.push(...result.data);
  emit('loaded');
};

const handleSelectChange = (value: any) => {
  emit('onSelectChange', value);
};

defineExpose({
  reload,
});
</script>

<style lang="scss" scoped>
.infinite-list-wrapper {
  text-align: center;

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(v-bind(itemMinWidth), 1fr));
    column-gap: v-bind(columnGap);
    row-gap: v-bind(rowGap);

    div:first-of-type {
      grid-column-start: 1;
      grid-column-end: 1;
    }
  }

  .no-more-text {
    font-style: italic;
    font-family: cursive;
  }
}
</style>
