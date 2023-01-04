<template>
  <div class="page-container">
    <section class="left-section">
      <div class="header-top" @click="goBack">
        <el-icon class="header-icon" :size="23"><ArrowLeft /></el-icon>
        <span>{{ appName }}</span>
      </div>
      <div class="search-wrapper">
        <el-input
          v-model="searchText"
          placeholder="根据页面名过滤"
          clearable
          @keyup.enter="search"
          @clear="handleClearInput"
        ></el-input>
        <el-icon class="header-icon" :size="21" @click="handleShowSearchInput"><Search /></el-icon>
        <el-icon class="header-icon" :size="20" @click="handleNewPage"><Plus /></el-icon>
      </div>
      <GridList
        ref="gridList"
        class="grid-list"
        column-gap="20px"
        row-gap="20px"
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
    <section class="right-section">
      <div v-if="active" class="right-top-bar">
        <span>{{ active?.name }}</span>
        <div>
          <el-button type="primary" size="large" @click="goEdit">编辑</el-button>
          <div class="pop-menu-wrapper">
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
                <div class="createInfo">
                  <p>{{ active?.createBy }} 创建于 {{ formatTime(active?.createTime ?? '') }}</p>
                  <p>{{ active?.updateBy }} 最近更新于 {{ formatTime(active?.updateTime ?? '') }}</p>
                  <p>编辑者: {{ active?.updateBy }}</p>
                </div>
              </template>
            </PopMenu>
          </div>
        </div>
      </div>
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

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import screenFull from 'screenfull';

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
console.log(active.value);

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
    name: 'fullScreen',
    label: '全屏',
    action: () => {
      if (screenFull.isEnabled && editWrapper.value) {
        screenFull.toggle(editWrapper.value);
      }
    },
  },
  {
    name: 'history',
    label: '历史版本',
    action: () => {
      router.push({
        path: '/version',
        query: {
          pageId: active.value?.pageId,
          applicationId: route.query.applicationId,
        },
      });
    },
  },
  {
    name: 'delete',
    label: '删除',
    action: () => {
      ElMessageBox.confirm(`此操作将永久删除${active.value?.name}, 是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          if (!active.value?.pageId) {
            return;
          }
          await pageApi.deletePage({
            pageIds: [active.value.pageId],
          });
          ElMessage.success('删除成功');
          gridList.value?.reload();
        })
        .catch(() => {});
    },
  },
];

const handleTopMenuClick = (value: string | number) => {
  const menu = topMenus.find(({ name }) => name === value);
  menu?.action();
};

const searchText = ref<string | null>(null);

const isSearch = ref<boolean>(false);

const newPageVisible = ref<boolean>(false);

const handleShowSearchInput = () => {
  isSearch.value = true;
  search();
};

const handleRenameSuccess = (value: ListPageItem) => {
  if (value.pageId === active.value?.pageId) {
    active.value = value;
  }
};

const search = () => {
  gridList.value?.reload();
  isSearch.value = false;
};

const handleNewPage = () => {
  newPageVisible.value = true;
};

const handleClearInput = () => {
  search();
};

const handleChangeActive = (value: ListPageItem) => {
  if (value.pageId !== active.value?.pageId) {
    active.value = value;
  }
};

const goEdit = () => {
  router.push({
    path: '/editor',
    query: {
      pageId: active.value?.pageId,
    },
  });
};
</script>

<style lang="scss" scoped>
.pop-menu-wrapper {
  position: relative;
}
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
.search-wrapper {
  display: flex;
  align-items: center;
  padding: 10px;
}
.item {
  cursor: pointer;
  width: 100%;
  height: 45px;
  line-height: 45px;
  padding-left: 10px;
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pop-menu-item {
  display: flex;
  align-items: center;
  span {
    margin-left: 15px;
  }
}
.page-container {
  display: flex;
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
  .grid-list {
    margin-top: 10px;
    height: calc(75vh);
    overflow-y: auto;
    div {
      text-align: left;
    }
  }
  .right-section {
    width: 82%;
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
      height: calc(100% - 75px);
      display: flex;
      align-items: center;
      justify-content: center;
      h1 {
        font-size: 30px;
      }
    }
  }
}
.createInfo {
  p {
    margin-top: 10px;
  }
}
</style>
