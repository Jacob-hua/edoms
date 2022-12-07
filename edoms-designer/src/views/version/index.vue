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
            <VersionListItem
              :data="item"
              :page-id="pageId"
              :is-active="item.versionId === active?.versionId"
              @click="handleActive(item)"
            />
          </template>
          <template #noMore>
            <div></div>
          </template>
        </GridList>
      </div>
    </section>
    <div class="version-right">
      <div v-if="active" class="top-bar">
        <span>{{ active?.name }}</span>
        <div>
          <el-button type="primary" size="large" @click="handleEdit">编辑</el-button>
          <el-button type="primary" size="large" @click="handleApply">应用此版本</el-button>
        </div>
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

const handleActive = async (item: Version) => {
  active.value = item;
};

const handleEdit = () => {
  router.push({
    path: '/editor',
    query: {
      versionId: active.value?.versionId,
      pageId: pageId.value,
    },
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
  display: flex;
}
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
    span {
      font-size: 20px;
      margin-left: 20px;
    }
  }
  .header-icon {
    cursor: pointer;
  }
}
.version-right {
  width: 80%;
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;

    & > span {
      font-size: 25px;
    }
    & > div {
      display: flex;
      align-items: center;
    }
    .el-icon {
      margin: 0 30px;
      cursor: pointer;
    }
  }
}
</style>
