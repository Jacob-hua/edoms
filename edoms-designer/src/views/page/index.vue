<template>
  <div class="page-container">
    <section class="header">
      <div class="back-btn" @click="goBack">
        <el-icon :size="23"><ArrowLeft /></el-icon>
        <span>{{ appName }}</span>
      </div>
      <PopMenu :width="330" @menu-click="handleTopMenuClick">
        <template #reference>
          <el-button type="primary" size="large">菜单</el-button>
        </template>
        <PopMenuOption v-for="(menu, index) in topMenus" :key="index" :label="menu.label" :value="menu.name">
          <div class="pop-menu-item">
            <span>{{ menu.label }}</span>
          </div>
        </PopMenuOption>
        <template #footer>
          <div class="version-info">
            <p>{{ active?.createBy }} 创建于 {{ formatTime(active?.createTime ?? '') }}</p>
            <p>{{ active?.updateBy }} 最近更新于 {{ formatTime(active?.updateTime ?? '') }}</p>
            <p>编辑者: {{ active?.updateBy }}</p>
          </div>
        </template>
      </PopMenu>
    </section>
    <section class="page-list">
      <GridList
        ref="gridList"
        class="grid-list"
        column-gap="20px"
        row-gap="10px"
        :page-size="20"
        item-min-width="200px"
        :request="loadData"
      >
        <template #default="{ item }: { item: ListPageItem }">
          <PageListItem
            :application-id="applicationId"
            :is-home-page="item.isHomePage"
            :data="item"
            :is-active="item.pageId === active?.pageId"
            @delete-success="handleReload"
            @use-index-success="handleReload"
            @rename-success="handleRenameSuccess"
            @change-active="handleChangeActive"
          />
        </template>
        <template #noMore>
          <div></div>
        </template>
      </GridList>
    </section>
    <section class="page-preview">
      <div ref="editWrapper" class="edit">
        <DSLPreview
          v-if="previewVisible"
          height="98%"
          :application-id="applicationId"
          :application-name="appName"
          :content-id="active?.pushContentId"
          :page-id="active?.pageId"
        />
      </div>
    </section>
  </div>
  <NewPageDialog
    v-if="newPageVisible"
    v-model:visible="newPageVisible"
    :application-id="applicationId"
    @success="handleReload"
  />
</template>

<script lang="ts" setup name="Page">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import pageApi from '@/api/page';
import DSLPreview from '@/components/DSLPreview.vue';
import GridList, { RequestFunc } from '@/components/GridList.vue';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';
import useDate from '@/hooks/useDate';

import NewPageDialog from './component/NewPageDialog.vue';
import PageListItem, { ListPageItem } from './component/PageListItem.vue';

const route = useRoute();

const router = useRouter();

const { formatTime } = useDate();

const gridList = ref();

const appName = ref<string>('');

const previewVisible = ref<boolean>(false);

const totalCount = ref<number>();

const active = ref<ListPageItem>();

const applicationId = ref<string>(route.query.applicationId as string);

const loadData: RequestFunc<ListPageItem> = async ({ pageSize, current }) => {
  const {
    dataList = [],
    count,
    applicationName,
    indexPageId = '',
  } = await pageApi.listPages({
    page: current,
    limit: pageSize,
    applicationId: route.query.applicationId as string,
    name: searchText.value,
  });
  totalCount.value = Number(count);
  appName.value = applicationName;
  active.value = dataList[0] ?? { pushContentId: null };
  if (totalCount.value) {
    previewVisible.value = true;
  }

  return {
    data: dataList.map<ListPageItem>((item) => ({
      ...item,
      isHomePage: indexPageId && indexPageId === item?.pageId ? true : false,
    })),
    total: Number(count),
  };
};

const goBack = () => {
  router.push('/');
};

const handleReload = () => {
  gridList.value?.reload();
};

const editWrapper = ref();

const topMenus = [
  {
    name: 'newVersion',
    label: '新建版本',
    action: () => {
      console.log('新建版本');
    },
  },
  {
    name: 'newPage',
    label: '新建页面',
    action: () => {
      newPageVisible.value = true;
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

const searchText = ref<string | null>(null);

const newPageVisible = ref<boolean>(false);

const handleRenameSuccess = (value: ListPageItem) => {
  if (value.pageId === active.value?.pageId) {
    active.value = value;
  }
};

const handleChangeActive = (value: ListPageItem) => {
  if (value.pageId !== active.value?.pageId) {
    active.value = value;
  }
};
</script>

<style lang="scss" scoped>
.pop-menu-item {
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

  .back-btn {
    display: flex;
    cursor: pointer;
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
  .right-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    padding-left: 10px;
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
  .edit {
    text-align: center;
    // height: calc(100% - 75px);
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
      font-size: 30px;
    }
  }
}

.version-info {
  p {
    margin-top: 10px;
  }
}
</style>
