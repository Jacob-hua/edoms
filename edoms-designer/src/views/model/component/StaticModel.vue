<template>
  <div>
    <GridList
      ref="gridList"
      class="grid-list"
      column-gap="20px"
      row-gap="20px"
      item-min-width="200px"
      :data-source="dataSource"
    >
      <template #default="{ item }">
        <div>{{ item.name }}</div>
      </template>
    </GridList>
  </div>
</template>

<script lang="ts" setup name="StaticModel">
import { ref } from 'vue';

import GridList from '@/components/GridList.vue';

defineProps<{
  application: string;
}>();
const gridList = ref(null);
const dataSource = ref([
  {
    name: '模型表1',
  },
  {
    name: '模型表2',
  },
  {
    name: '模型表3',
  },
  {
    name: '模型表4',
  },
]);
</script>

<style lang="scss" scoped>
.container {
  .grid-list {
    height: 50px;
    width: 300px;
    div {
      text-align: left;
    }
  }
}
</style>
