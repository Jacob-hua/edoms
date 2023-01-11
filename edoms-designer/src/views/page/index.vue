<template>
  <div class="page-container">
    <section class="header">
      <div>
        <div class="back-btn" @click="goBack">
          <el-icon :size="23"><ArrowLeft /></el-icon>
          <span>{{ appName }}</span>
        </div>
        <el-select
          v-model="curVersion"
          filterable
          remote
          reserve-keyword
          remote-show-suffix
          :remote-method="loadData"
          :loading="versionSelectLoading"
        >
          <el-option v-for="{ name, versionId } in versionList" :key="versionId" :value="versionId" :label="name">
            {{ name }}
          </el-option>
        </el-select>
      </div>
      <PopMenu :width="330" @menu-click="handleTopMenuClick">
        <template #reference>
          <el-button type="primary" size="large">菜单</el-button>
        </template>
        <PopMenuOption v-for="(menu, index) in topMenus" :key="index" :label="menu.label" :value="menu.name">
          <div class="top-menu-item">
            <span>{{ menu.label }}</span>
          </div>
        </PopMenuOption>
      </PopMenu>
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

import versionApi, { ListVersionResItem } from '@/api/version';
import DSLPreview from '@/components/DSLPreview.vue';
import GridList from '@/components/GridList.vue';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';

import NewVersionDialog from './component/NewVersionDialog.vue';
import PageListItem, { ListPageItem } from './component/PageListItem.vue';

const route = useRoute();

const router = useRouter();

const gridListRef = ref();

const appName = ref<string>('');

const active = ref<ListPageItem>();

const applicationId = ref<string>(route.query.applicationId as string);

const curVersion = ref<string>();

const versionList = ref<ListVersionResItem[]>([]);

const versionSelectLoading = ref<boolean>(false);

const loadData = async (name: string) => {
  versionSelectLoading.value = true;
  if (!applicationId.value) {
    return;
  }
  const { dataList, applicationName } = await versionApi.listVersions({
    applicationId: applicationId.value,
    page: 1,
    limit: 10,
    name,
  });

  versionList.value = dataList;
  appName.value = applicationName;
  versionSelectLoading.value = false;
};

watch(
  () => applicationId.value,
  () => {
    loadData('');
  },
  { immediate: true }
);

const goBack = () => {
  router.push('/');
};

const handleReload = () => {
  gridListRef.value?.reload();
};

const topMenus = [
  {
    name: 'newVersion',
    label: '新建版本',
    action: () => {
      newVersionVisible.value = true;
    },
  },
  {
    name: 'exportApplication',
    label: '导出应用',
    action: () => {
      console.log('导出应用');
    },
  },
];

const handleTopMenuClick = (value: (string | number)[]) => {
  const menu = topMenus.find(({ name }) => name === value[0]);
  menu?.action();
};

const newVersionVisible = ref<boolean>(false);

const handleSelectChange = (value: ListPageItem) => {
  if (value.pageId !== active.value?.pageId) {
    active.value = value;
  }
};
</script>

<style lang="scss" scoped>
.top-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;

  span {
    margin-left: 15px;
    width: 100%;
  }
}

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
