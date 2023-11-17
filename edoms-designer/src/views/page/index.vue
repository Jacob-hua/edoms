<template>
  <div class="page-container">
    <section class="header">
      <div>
        <div class="back-btn" @click="goBack">
          <el-icon :size="23">
            <ArrowLeft />
          </el-icon>
          <span>{{ appName }}</span>
        </div>
        <SwitchVersion v-model="version" :application-id="applicationId" :title="t('page.切换版本')">
          <div class="version-btn">
            <span>{{ version?.name }}</span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </div>
        </SwitchVersion>
      </div>
      <div>
        <el-button type="primary" text bg size="large" :icon="FullScreen" @click="handlePreview">{{
          t('page.预览')
        }}</el-button>
        <el-button type="primary" text bg size="large" :icon="Edit" @click="handleEdit">{{ t('page.编辑') }}</el-button>
        <el-button type="primary" text bg size="large" :icon="DocumentAdd" @click="handleNewVersion">
          {{ t('page.新建版本') }}
        </el-button>
        <el-button
          v-role="['manager']"
          type="primary"
          text
          bg
          size="large"
          :icon="Download"
          :loading="loading"
          @click="handleExportApplication"
        >
          {{ t('page.导出应用') }}
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
          <el-empty :description="t('page.暂无页面')" />
        </template>
      </GridList>
    </section>
    <section class="page-preview">
      <el-dialog v-model="dslDownloadProgress" :show-close="false" :width="400" :height="300">
        <div class="dsl-block">
          <div>DSL数据加载中...</div>
          <div class="progress">
            <el-progress
              :percentage="100"
              :stroke-width="20"
              status="success"
              :striped="true"
              color="#c1c1c1"
              :striped-flow="true"
              :show-text="false"
              :duration="10"
            />
          </div>
        </div>
      </el-dialog>
      <DSLPreview class="edit" height="98%" :content-id="version?.contentId" :page-id="active?.id" />
    </section>
  </div>
  <NewVersionDialog
    v-model:visible="newVersionVisible"
    :application-id="applicationId"
    :application-name="appName"
    @success="handleReload"
  />
</template>

<script lang="ts" setup name="Page">
import { onActivated, ref, shallowRef, unref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { DocumentAdd, Download, Edit, FullScreen } from '@element-plus/icons-vue';

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
const { t } = useI18n();

const route = useRoute();

const router = useRouter();

const gridListRef = ref();

const appName = ref<string>('');

const applicationAddress = ref<string>('');

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
    const { name, defaultVersionId, defaultVersionName, defaultVersionContentId, serviceAddress } =
      await applicationApi.getApplication({
        applicationId,
      });
    applicationAddress.value = serviceAddress;
    appName.value = name;
    version.value = {
      versionId: defaultVersionId,
      name: defaultVersionName,
      contentId: defaultVersionContentId,
    };
  },
  { immediate: true }
);

onActivated(() => {
  const contentId = route.query.contentId as string;
  const oldVersion = unref(version);
  if (oldVersion && contentId) {
    oldVersion['contentId'] = route.query.contentId as string;
    version.value = oldVersion;
    updateDsl();
  }
});

const { execute: downloadDsl, loading: dslDownloadProgress } = useDownloadDSL();

watch(() => version.value, updateDsl, { immediate: true });

async function updateDsl() {
  if (!version.value?.contentId) {
    pageList.value = [];
    return;
  }
  const dsl = await downloadDsl(version.value.contentId);
  pageList.value = dsl.items;
  active.value = dsl.items?.[0];
  handleReload();
}

const goBack = () => {
  router.push('/');
};

const handleReload = () => {
  gridListRef.value?.reload();
};

const previewPath = import.meta.env.VITE_PREVIEW_PATH;

// 预览
const handlePreview = () => {
  const previewUrl = `${previewPath}${applicationAddress.value}/${version.value?.versionId ?? ''}`;
  window.open(previewUrl);
};
// 编辑
const handleEdit = () => {
  router.push({
    path: '/editor',
    query: {
      applicationId: applicationId.value,
      versionId: version.value?.versionId,
      pageId: active.value?.id,
    },
  });
};

const handleNewVersion = () => {
  newVersionVisible.value = true;
};

const { execute: handleExportApplication, loading } = useExport(
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
  :deep(.el-dialog__header) {
    padding: 0;
  }
}
.dsl-block {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .progress {
    width: 100%;
    margin-top: 10px;
  }
}
</style>

<style>
@keyframes striped-flow {
  0% {
    background-position: -100%;
  }
  100% {
    background-position: 100%;
  }
}

.page-preview .el-progress-bar__inner {
  -webkit-animation: striped-flow 3s linear infinite;
  animation: striped-flow 3s linear infinite;
  animation-duration: 15s;
  background-image: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.1) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1.45em 1.25em;
}
</style>
