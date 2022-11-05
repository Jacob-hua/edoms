<template>
  <div class="page-container">
    <section class="left-section">
      <div class="header-top">
        <el-icon class="header-icon" :size="23"><ArrowLeft /></el-icon>
        <span>陕汽冷站</span>
      </div>
      <div class="top-search">
        <p>页面列表</p>
        <div>
          <el-icon class="header-icon" :size="19"><Search /></el-icon>
          <el-icon class="header-icon" :size="20"><Plus /></el-icon>
        </div>
      </div>
      <GridList
        ref="gridList"
        class="grid-list"
        column-gap="20px"
        row-gap="20px"
        item-min-width="200px"
        :request="loadData"
      >
        <template #default="{ item }">
          <div class="item">{{ item.name }}</div>
        </template>
        <template #noMore>
          <div></div>
        </template>
      </GridList>
    </section>
    <section class="right-section"></section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import GridList, { RequestFunc } from '@/components/GridList.vue';

const gridList = ref(null);
const loadData: RequestFunc<{ name: string }> = async () => {
  const dataSource = [
    {
      name: `模型表1`,
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
  ];
  return {
    data: dataSource,
    total: dataSource.length,
  };
};
</script>

<style lang="scss">
.item {
  cursor: pointer;
  padding-left: 10px;
  border-bottom: 1px solid #e1e1e1;
}
.page-container {
  .left-section {
    border-right: 1px solid #e1e1e1;
    width: 20%;
    height: calc(100vh - 60px);
    .header-top {
      padding: 15px 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e1e1e1;
      .header-icon {
        cursor: pointer;
      }
      span {
        font-size: 20px;
        margin-left: 20px;
      }
    }
    .top-search {
      div {
        cursor: pointer;
      }
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  display: flex;
  .grid-list {
    margin-top: 10px;
    height: calc(100vh - 160px);
    overflow-y: auto;
    div {
      text-align: left;
    }
  }
  .right-section {
    width: 82%;
  }
}
</style>
