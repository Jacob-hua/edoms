<template>
  <div class="infinite-list-wrapper" style="overflow: auto">
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
import { computed, reactive, ref } from 'vue';

export interface GridListItem {
  label?: string | number;
}

type RequestFunc = (data: GridListItem[]) => GridListItem[];

const props = withDefaults(
  defineProps<{
    request: RequestFunc;
    itemMinWidth?: string;
    rowGap?: string;
    columnGap?: string;
  }>(),
  {
    itemMinWidth: () => '200px',
    rowGap: () => '0px',
    columnGap: () => '0px',
  }
);

const emit = defineEmits<{
  (event: 'loadMore'): void;
}>();

const data = reactive<GridListItem[]>([]);

const loading = ref(false);
const noMore = ref(false);
const disabled = computed(() => loading.value || noMore.value);

const load = async () => {
  emit('loadMore');
  loading.value = true;
  const newData = await Promise.resolve(props.request(data));
  loading.value = false;
  if (newData.length === 0) {
    noMore.value = true;
  }
  data.push(...newData);
};
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
