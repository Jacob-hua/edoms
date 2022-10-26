<template>
  <div>
    <GridList class="test" column-gap="20px" row-gap="20px" :request="loadData">
      <template #default="{ item }">
        {{ item }}
      </template>
      <template #loading>
        <p>加载中....</p>
      </template>
      <template #noMore>
        <p>没有更多了</p>
      </template>
    </GridList>
  </div>
</template>

<script lang="ts" setup>
import GridList, { GridListItem } from '@/components/GridList.vue';

let i = 0;

const loadData = (): GridListItem[] => {
  i++;
  console.log(i);

  if (i < 100) {
    return [
      {
        label: i + 1,
      },
      {
        label: i + 2,
      },
      {
        label: i + 3,
      },
      {
        label: i + 4,
      },
      {
        label: i + 5,
      },
      {
        label: i + 6,
      },
      {
        label: i + 7,
      },
    ];
  }
  return [];
};
</script>

<style lang="scss" scoped>
.test {
  height: 200px;
}
</style>
