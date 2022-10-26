<template>
  <div>
    <GridList ref="gridList" class="test" column-gap="20px" row-gap="20px" :page-size="5" :request="loadData">
      <template #default="{ item }">
        <div class="item">
          {{ item }}
        </div>
      </template>
      <template #loading>
        <p>加载中....</p>
      </template>
      <template #noMore>
        <p>没有更多了</p>
      </template>
    </GridList>
    <el-button @click="refreshGridList">强制刷新</el-button>
    <PopMenu trigger="hover" @menu-click="handlePopMenuClick">
      <template #header>
        <h1>Title</h1>
      </template>
      <template #footer>
        <h1>Footer</h1>
      </template>
      <PopMenuOptGroup label="分组1" disabled>
        <PopMenuOption label="测试1" value="1"></PopMenuOption>
        <PopMenuOption label="测试2" value="2" disabled></PopMenuOption>
        <template #groupFooter>
          {{ '测试' }}
        </template>
      </PopMenuOptGroup>
      <PopMenuOptGroup label="分组2">
        <PopMenuOption label="测试1" value="1"></PopMenuOption>
        <PopMenuOption label="测试2" value="2" disabled></PopMenuOption>
        <template #groupFooter>
          {{ '测试' }}
        </template>
      </PopMenuOptGroup>
    </PopMenu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { listApplications } from '@/api/application';
import GridList, { GridListItem, RequestFunc } from '@/components/GridList.vue';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOptGroup from '@/components/PopMenuOptGroup.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';

const gridList = ref();

const loadData: RequestFunc = async ({ pageSize, current }) => {
  const { dataList, count } = await listApplications({ page: current, limit: pageSize });
  return {
    data: dataList as GridListItem[],
    total: Number(count),
  };
};

const refreshGridList = () => {
  gridList.value?.reload();
};

const handlePopMenuClick = (selectedValue: number | string) => {
  console.log('ddd', selectedValue);
};
</script>

<style lang="scss" scoped>
.test {
  height: 200px;
}
.item {
  background-color: aqua;
}
</style>
