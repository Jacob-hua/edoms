<template>
  <el-container class="version-container">
    <el-header height="40px">
      <span class="title">{{ $t('version.versionList') }}</span>
    </el-header>
    <el-main v-loading="loading" element-loading-text="Loading...">
      <div class="version-list">
        <VersionListTable
          :table-data="versionList || []"
          :application-name="appName"
          :application-id="applicationId"
          :application-address="appInfo.serviceAddress"
          :default-version-id="appInfo.defaultVersionId"
          @delete-success="handleEditSuccess"
          @update-success="handleEditSuccess"
        >
        </VersionListTable>
      </div>
      <div class="version-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          background
          layout="prev, pager, next"
          :total="totalCount"
          :pager-count="pagerCount"
          @update:current-page="handlePageChange"
          @current-change="handlePageChange"
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

import VersionListTable from './VersionListTable.vue';

const route = useRoute();

const versionList = ref<ListVersionResItem[]>();

const totalCount = ref<number>(0);
const currentPage = ref<number>(1);

const loading = ref<boolean>(false);

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
  loading.value = true;
  try {
    const { dataList, count, applicationName }: ListVersionsRes = await versionApi.listVersions({
      applicationId: applicationId.value,
      page: currentPage.value,
      limit: props.pageSize,
    });
    loading.value = false;
    versionList.value = dataList;
    totalCount.value = Number(count);
    appName.value = applicationName;
  } catch (e: any) {
    console.log(e);
    loading.value = false;
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
