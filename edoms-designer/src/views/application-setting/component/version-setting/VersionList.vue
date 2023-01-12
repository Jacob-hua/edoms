<template>
  <el-container class="version-container">
    <el-header height="40px">
      <span class="title">版本列表</span>
    </el-header>
    <el-main>
      <div class="version-list">
        <VersionListItem
          v-for="(item, index) in versionList"
          :key="index"
          :version-item="item"
          :application-name="appName"
          :application-id="applicationId"
          :default-version-id="appInfo.defaultVersionId"
          @delete-success="handleEditSuccess"
          @update-success="handleEditSuccess"
        >
        </VersionListItem>
      </div>
      <div class="version-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          background
          layout="prev, pager, next"
          :page-count="totalCount"
          :pager-count="pagerCount"
          @update:current-page="handlePageChange"
        >
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup name="VersionList">
import { nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { GetApplicationRes } from '@/api/application';
import type { ListVersionResItem, ListVersionsRes } from '@/api/version';
import versionApi from '@/api/version';

import VersionListItem from './VersionListItem.vue';

const route = useRoute();

const versionList = ref<ListVersionResItem[]>();

const totalCount = ref<number>(0);
const currentPage = ref<number>(1);

const applicationId = ref<string>(route.query.applicationId as string);
const appName = ref<string>('');

const props = withDefaults(
  defineProps<{
    pageSize?: number;
    pagerCount?: number;
    appInfo: GetApplicationRes;
  }>(),
  {
    pageSize: () => 10,
    pagerCount: () => 7,
  }
);

const load = async () => {
  try {
    const { dataList, count, applicationName }: ListVersionsRes = await versionApi.listVersions({
      applicationId: applicationId.value,
      page: currentPage.value,
      limit: props.pageSize,
    });
    versionList.value = dataList;
    totalCount.value = Number(count);
    appName.value = applicationName;
  } catch (e: any) {
    console.log(e);
  }
};

const reload = () => {
  nextTick(() => {
    load();
  });
};

const handleEditSuccess = () => {
  reload();
};

const handlePageChange = () => {
  reload();
};

onMounted(() => load());
</script>

<style lang="scss" scoped>
.version-container {
  width: 1000px;
  margin: auto;

  .title {
    line-height: 100%;
    font-size: 24px;
    font-weight: bold;
  }

  .version-list {
    border: 1px solid #eee;
    padding: 20px 10px;
    margin-bottom: 10px;
    border-radius: 4px;
  }

  .version-pagination {
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>
