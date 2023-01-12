<template>
  <div class="page-container">
    <section class="header">
      <div>
        <div class="back-btn" @click="goBack">
          <el-icon :size="23"><ArrowLeft /></el-icon>
          <span>{{ appName }}</span>
        </div>
        <SwitchVersion v-model="version" :application-id="applicationId" title="切换版本">
          <div class="version-btn">
            <span>{{ version?.name }}</span>
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </div>
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
        :data-source="pageList"
        @on-select-change="handleSelectChange"
      >
        <template #default="{ item }: { item: MPage }">
          <PageListItem :data="item" :is-active="item.id === active?.id" />
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
      <DSLPreview class="edit" height="98%" :content-id="version?.contentId" :page-id="active?.id" />
    </section>
  </div>
  <NewVersionDialog v-model:visible="newVersionVisible" :application-id="applicationId" @success="handleReload" />
</template>

<script lang="ts" setup name="Page">
import { ref, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DocumentAdd, Download, Edit } from '@element-plus/icons-vue';

import { MPage } from '@edoms/schema';

import applicationApi from '@/api/application';
import DSLPreview from '@/components/DSLPreview.vue';
import GridList from '@/components/GridList.vue';
import { MimeType } from '@/const/mime';
import useDownloadDSL from '@/hooks/useDownloadDSL';
import useExport from '@/hooks/useExport';

import NewVersionDialog from './component/NewVersionDialog.vue';
import PageListItem from './component/PageListItem.vue';
import SwitchVersion, { VersionModel } from './component/SwitchVersion.vue';

const route = useRoute();

const router = useRouter();

const gridListRef = ref();

const appName = ref<string>('');

const version = ref<VersionModel>();

const active = ref<MPage>();

const applicationId = ref<string>(route.query.applicationId as string);

const newVersionVisible = ref<boolean>(false);

const pageList = shallowRef<MPage[]>([]);

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
    version.value = {
      versionId: defaultVersionId,
      name: defaultVersionName,
      contentId: defaultVersionContentId,
    };
  },
  { immediate: true }
);

const { execute: downloadDsl } = useDownloadDSL();

watch(version, async (version) => {
  if (!version?.contentId) {
    pageList.value = [];
    return;
  }
  const dsl = await downloadDsl(version.contentId);
  pageList.value = dsl.items;
  active.value = dsl.items?.[0];
});

const goBack = () => {
  router.push('/');
};

const handleReload = () => {
  gridListRef.value?.reload();
};

const handleEdit = () => {
  router.push({
    path: '/editor',
    query: {
      applicationId: applicationId.value,
      versionId: version.value?.versionId,
    },
  });
};

const handleNewVersion = () => {
  newVersionVisible.value = true;
};

const { execute: handleExportApplication } = useExport(
  async () =>
    await applicationApi.exportApplication({
      applicationId: applicationId.value,
      versionId: version.value?.versionId ?? '',
    }),
  () => `${appName.value}（${version.value?.name}）.zip`,
  MimeType.ZIP
);

const handleSelectChange = (value: MPage) => {
  if (value.id !== active.value?.id) {
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
  padding: 0 8px;
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
