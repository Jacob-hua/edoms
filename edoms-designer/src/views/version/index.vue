<template>
  <div class="version-container">
    <section class="left-section">
      <div class="header-top" @click="goBack">
        <el-icon class="header-icon" :size="23"><ArrowLeft /></el-icon>
        <span>历史版本</span>
      </div>
      <div>
        <GridList
          ref="gridList"
          class="grid-list"
          column-gap="20px"
          :page-size="99999999"
          item-min-width="200px"
          :request="loadData"
        >
          <template #default="{ item }: { item: Version }">
            <VersionListItem :data="item" :page-id="pageId" />
          </template>
          <template #noMore>
            <div></div>
          </template>
        </GridList>
      </div>
    </section>
    <div class="version-right">
      <div class="top-bar">
        <el-button type="primary" size="large" @click="handleApply">应用此版本</el-button>
        <el-button type="primary" size="large" @click="goEdit">编辑</el-button>
      </div>
      <div class="preview-wrapper">
        <DSLPreview
          v-if="previewVisible"
          height="100%"
          :application-id="applicationId"
          :content-id="active?.pushContentId"
          :page-id="active?.pageId"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

import type { Version } from '@/api/version';
import versionApi from '@/api/version';
import DSLPreview from '@/components/DSLPreview.vue';
import GridList from '@/components/GridList.vue';

import VersionListItem from './component/VersionListItem.vue';

const route = useRoute();

const router = useRouter();

const gridList = ref();

const active = ref<Version>();

const previewVisible = ref(false);

const applicationId = computed(() => route.query.applicationId as string);

const pageId = computed<string>(() => route.query.pageId as string);

const loadData = async ({ pageSize, current }: { pageSize: number; current: number }) => {
  const { dataList } = await versionApi.listVersions({
    page: current,
    limit: pageSize,
    pageId: pageId.value,
  });
  active.value = dataList[0];
  dataList.forEach((data: any) => {
    data.isShowText = true;
  });
  if (dataList.length) {
    previewVisible.value = true;
  }
  return {
    data: dataList,
    total: dataList.length,
  };
};

const goBack = () => {
  router.go(-1);
};

const handleApply = async () => {
  if (!active.value?.versionId) {
    return;
  }
  await versionApi.recoveryVersion({
    versionId: active.value.versionId,
  });
  ElMessage.success('应用版本成功');
  router.push({
    path: '/page',
    query: {
      applicationId: applicationId.value,
    },
  });
};

const goEdit = () => {
  router.push({
    path: '/editor',
  });
};
</script>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
}
.preview-wrapper {
  height: calc(100% - 75px);
}
.version-container {
  .item {
    cursor: pointer;
    width: 100%;
    height: 100px;
    padding-left: 10px;
    line-height: unset !important;
    display: block !important;
    border-bottom: 1px solid #e1e1e1;
    p {
      width: 100%;
      margin-bottom: 10px;
    }
    .icon-wrapper {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        .el-icon {
          margin-right: 10px;
        }
      }
    }
  }
  display: flex;
  .grid-list {
    margin-top: 10px;
    height: calc(100vh - 180px);
    overflow-y: auto;
    div {
      text-align: left;
    }
  }
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
  .version-right {
    width: 80%;
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 15px;
      padding-top: 15px;
    }
  }
}
</style>
