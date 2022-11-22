<template>
  <div class="container">
    <div class="container-right">
      <GridList
        ref="gridList"
        class="grid-list"
        column-gap="20px"
        row-gap="20px"
        item-min-width="250px"
        :page-size="10"
        :request="loadData"
      >
        <template #operation>
          <div class="slot-container" @click="handleCreateApp">
            <div class="app-add-box">
              <el-icon :size="55"><Plus /></el-icon>
            </div>
            新建应用
          </div>
        </template>
        <template #default="{ item }">
          <ApplicationItem :application="item"></ApplicationItem>
        </template>
      </GridList>
    </div>
    <NewApplication v-model:visible="visible" @submitted="handleAppCreated"></NewApplication>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { listApplications } from '@/api/application';
import { ApplicationInfo, ListApplicationsRes } from '@/api/application/type';
import NoData from '@/assets/img/no_data.png';
import GridList, { RequestFunc } from '@/components/GridList.vue';

import ApplicationItem from './component/ApplicationItem.vue';
import NewApplication from './component/NewApplication.vue';
const gridList = ref();
const visible = ref<boolean>(false);
const loadData: RequestFunc<ApplicationInfo> = async ({ pageSize, current }) => {
  const { dataList, count }: ListApplicationsRes = await listApplications({
    page: current,
    limit: pageSize,
  });
  dataList.forEach((item: ApplicationInfo) => {
    if (item.thumbnailId) {
      item.imgUrl = `${import.meta.env.VITE_BASE_API}/file/preview/?contentId=${item.thumbnailId}`;
    } else {
      item.imgUrl = NoData;
    }
  });
  return {
    data: dataList,
    total: Number(count),
  };
};

const handleCreateApp = () => {
  visible.value = true;
};

const handleAppCreated = () => {
  gridList.value?.reload();
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  margin-top: 30px;
  .container-left {
    width: 30%;
    margin-right: 40px;
    border-right: 1px solid #3333;
    .user-info {
      margin-top: 35px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 200px;
      margin-left: 30%;
      background-size: 200px 200px;
      img {
        width: 200px;
        height: 200px;
      }
    }
  }
  .container-right {
    width: 100%;
    .grid-list {
      height: 760px;
    }
  }
}
.slot-container {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.app-add-box {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
}
</style>
