<template>
  <div>
    <GridList class="test" column-gap="20px" row-gap="20px">
      <template #default="item">
        {{ item.item }}
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
import GridList from '@/components/GridList.vue';
</script>

<style lang="scss" scoped>
.test {
  height: 200px;
}
</style>
