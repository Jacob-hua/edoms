<template>
  <div class="infinite-list-wrapper" style="overflow: auto">
    <div v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled">
      <div v-for="i in count" :key="i">
        <slot name="item">
          {{ i }}
        </slot>
      </div>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-if="noMore">No more</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

withDefaults(
  defineProps<{
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

const count = ref(10);
const loading = ref(false);
const noMore = computed(() => count.value >= 20);
const disabled = computed(() => loading.value || noMore.value);

const load = () => {
  loading.value = true;
  setTimeout(() => {
    count.value += 2;
    loading.value = false;
  }, 2000);
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
