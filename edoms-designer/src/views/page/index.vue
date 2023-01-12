<template>
  <div class="page-container">
    <section class="header">
      <div>
        <div class="back-btn" @click="goBack">
          <el-icon :size="23"><ArrowLeft /></el-icon>
          <span>{{ appName }}</span>
        </div>
        <SwitchVersion v-model="defaultVersion" :application-id="applicationId">
          <template #default="{ version }">
            <div class="version-btn">
              <span>{{ version?.name ?? defaultVersion?.name }}</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </div>
          </template>
        </SwitchVersion>
      </div>
      <div>
        <el-button type="primary" text bg size="large" :icon="Edit" @click="handleEdit">编辑</el-button>
        <el-button type="primary" text bg size="large" :icon="DocumentAdd" @click="handleNewVersion">
          新建版本
        </el-button>
        <el-button type="primary" text bg size="large" :icon="Download" @click="handleExportApplication">
          导出应用
        </el-button>
      </div>
    </section>
    <section class="page-list">
      <GridList
        ref="gridListRef"
        class="grid-list"
        column-gap="20px"
        row-gap="10px"
        :page-size="20"
        item-min-width="200px"
        @on-select-change="handleSelectChange"
      >
        <template #default="{ item }: { item: ListPageItem }">
          <PageListItem
            :application-id="applicationId"
            :is-home-page="item.isHomePage"
            :data="item"
            :is-active="item.pageId === active?.pageId"
          />
        </template>
        <template #noMore>
          <div></div>
        </template>
        <template #empty>
          <el-empty description="暂无页面" />
        </template>
      </GridList>
    </section>
    <section class="page-preview">
      <DSLPreview
        class="edit"
        height="98%"
        :application-id="applicationId"
        :application-name="appName"
        :content-id="active?.pushContentId"
        :page-id="active?.pageId"
      />
    </section>
  </div>
  <NewVersionDialog v-model:visible="newVersionVisible" :application-id="applicationId" @success="handleReload" />
</template>

<script lang="ts" setup name="Page">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DocumentAdd, Download, Edit } from '@element-plus/icons-vue';

import applicationApi from '@/api/application';
import DSLPreview from '@/components/DSLPreview.vue';
import GridList from '@/components/GridList.vue';
import { MimeType } from '@/const/mime';
import useExport from '@/hooks/useExport';

import NewVersionDialog from './component/NewVersionDialog.vue';
import PageListItem, { ListPageItem } from './component/PageListItem.vue';
import SwitchVersion, { VersionModel } from './component/SwitchVersion.vue';

const route = useRoute();

const router = useRouter();

const gridListRef = ref();

const appName = ref<string>('');

const defaultVersion = ref<VersionModel>();

const active = ref<ListPageItem>();

const applicationId = ref<string>(route.query.applicationId as string);

watch(
  () => applicationId.value,
  async (applicationId) => {
    if (!applicationId) {
      return;
    }
    const { name, defaultVersionId, defaultVersionName, defaultVersionContentId } = await applicationApi.getApplication(
      {
        applicationId,
      }
    );
    appName.value = name;
    defaultVersion.value = {
      versionId: defaultVersionId,
      name: defaultVersionName,
      contentId: defaultVersionContentId,
    };
  },
  { immediate: true }
);

const goBack = () => {
  router.push('/');
};

const handleReload = () => {
  gridListRef.value?.reload();
};

const newVersionVisible = ref<boolean>(false);

const handleEdit = () => {
  router.push({
    path: '/editor',
  });
};

const handleNewVersion = () => {
  newVersionVisible.value = true;
};

const { execute: handleExportApplication } = useExport(
  async () => {
    const result = await applicationApi.exportApplication({
      applicationId: applicationId.value,
    });
    return result;
  },
  () => `${appName.value}.zip`,
  MimeType.ZIP
);

const handleSelectChange = (value: ListPageItem) => {
  if (value.pageId !== active.value?.pageId) {
    active.value = value;
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  grid-template-rows: 50px 1fr;
}

.header {
  grid-column-start: 1;
  grid-column-end: 3;
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > div:first-child {
    display: flex;
    align-items: center;
  }

  .back-btn {
    width: 160px;
    display: flex;
    cursor: pointer;
    margin-right: 20px;
  }

  .version-btn {
    padding: 2px 8px;
    border: 1px solid #e1e1e1;
    border-radius: 3px;
    width: 150px;
    display: flex;
    align-items: center;
    cursor: pointer;

    & > span:first-child {
      flex-grow: 1;
    }
  }
}

.page-list {
  border-right: 1px solid #e1e1e1;
  height: calc(100vh - 60px);
}

.grid-list {
  height: calc(75vh);
  overflow-y: auto;
}

.page-preview {
  overflow: hidden;
}
</style>
