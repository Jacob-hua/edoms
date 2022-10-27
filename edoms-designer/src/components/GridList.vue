<template>
  <div v-if="isAlive" class="infinite-list-wrapper" style="overflow: auto">
    <div v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled" :infinite-scroll-distance="10">
      <slot name="operation"></slot>
      <div v-for="(item, index) in data" :key="index">
        <slot :item="item" :index="index">
          {{ item }}
        </slot>
      </div>
    </div>
    <slot v-if="loading" name="loading">
      <p>Loading...</p>
    </slot>
    <slot v-if="noMore" name="noMore">
      <p>No more</p>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';

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
    request: () => () => ({
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
}>();

const isAlive = ref(true);
const loading = ref(false);
const noMore = ref(false);
const data = ref(props.dataSource);
const total = ref(0);
const current = ref(1);
const pages = computed(() => Math.ceil(total.value / props.pageSize));
const disabled = computed(() => loading.value || noMore.value);

const reload = () => {
  isAlive.value = false;
  nextTick(() => {
    isAlive.value = true;
    data.value.length = 0;
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
  current.value += 1;
  if (result.data.length === 0 || current.value > pages.value) {
    noMore.value = true;
  } else {
    data.value.push(...result.data);
  }
  emit('loaded');
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
    grid-template-columns: repeat(auto-fit, minmax(v-bind(itemMinWidth), 1fr));
    column-gap: v-bind(columnGap);
    row-gap: v-bind(rowGap);
  }
}
</style>
