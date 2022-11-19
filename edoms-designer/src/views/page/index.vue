<template>
  <div class="page-container">
    <section class="left-section">
      <div class="header-top" @click="goBack">
        <el-icon class="header-icon" :size="23"><ArrowLeft /></el-icon>
        <span>{{ name }}</span>
      </div>
      <div class="top-search">
        <p>页面列表</p>
        <div>
          <el-icon class="header-icon" :size="20" @click="handleNewPage"><Plus /></el-icon>
        </div>
      </div>
      <div class="search-wrapper">
        <el-input v-model="searchText" clearable @keyup.enter="search" @clear="handleClearInput"></el-input>
        <el-icon class="header-icon" :size="21" @click="handleShowSearchInput"><Search /></el-icon>
      </div>
      <GridList
        ref="gridList"
        class="grid-list"
        column-gap="20px"
        row-gap="20px"
        :page-size="99999999"
        item-min-width="200px"
        :request="loadData"
      >
        <template #default="{ item }">
          <div :class="['item', item.pageId === active.pageId ? 'active' : '']">
            <p v-if="item.isShowText" @click="handleActive(item)">{{ item.name }}</p>
            <el-input v-if="!item.isShowText" v-model="item.name" clearable></el-input>
            <div v-if="item.isShowText" class="pop-menu-wrapper">
              <PopMenu @menu-click="(value) => handleMenuClick(value, item)">
                <PopMenuOption v-for="(menu, index) in menus" :key="index" :label="menu.label" :value="menu.name">
                  <div class="pop-menu-item">
                    <el-icon :size="20">
                      <component :is="menu.icon" />
                    </el-icon>
                    <span>{{ menu.label }}</span>
                  </div>
                </PopMenuOption>
              </PopMenu>
            </div>
            <div v-if="!item.isShowText" style="display: flex; padding: 0 10px">
              <el-icon :size="20" @click="handleChangeName(item)"><Check /></el-icon>
            </div>
          </div>
        </template>
        <template #noMore>
          <div></div>
        </template>
      </GridList>
    </section>
    <section class="right-section">
      <div class="right-top-bar">
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
            <div class="createInfo">
              <p>{{ active?.createBy }} 创建于 {{ formatTime(active?.createTime) }}</p>
              <p>{{ active?.updateBy }} 最近更新于 {{ formatTime(active?.updateTime) }}</p>
              <p>编辑者: {{ active?.updateBy }}</p>
            </div>
          </PopMenu>
        </div>
      </div>
      <div ref="editWrapper" class="edit">
        <iframe v-if="previewVisible" width="100%" :height="stageRect && stageRect.height" :src="previewUrl"></iframe>
      </div>
    </section>
  </div>
  <div class="page-wrapper">
    <el-dialog v-model="newPageVisible" title="新增页面" width="30%" @close="handleClose">
      <span>
        <el-form ref="form" :model="page" :rules="rules">
          <el-form-item label="应用页名称" prop="name">
            <el-input v-model="page.name" clearable></el-input>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="newPageVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="versionVisible" title="保存为版本" width="30%" @close="handleVersionClose">
      <span>
        <el-form ref="versionForm" :model="version" :rules="versionRules">
          <el-form-item label="版本名称" prop="name">
            <el-input v-model="version.name" clearable></el-input>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="versionVisible = false">取消</el-button>
          <el-button type="primary" @click="handleVersionConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import screenFull from 'screenfull';

import { EdomsEditor } from '@edoms/editor';

import { createPage, deletePage, listPages, updatePage } from '@/api/page';
import { saveWithVersion } from '@/api/version';
import GridList, { RequestFunc } from '@/components/GridList.vue';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';
import useDate from '@/hooks/useDate';
const route = useRoute();
const router = useRouter();
const gridList = ref();
const { formatTime } = useDate();
interface Page {
  pageId: number;
  name: string;
  createBy: string;
  createTime: bigint;
  publishContentId: string;
  editContentId: string;
  description: string;
  updateBy: string;
  updateTime: bigint;
  applicationId: string;
  isShowText: boolean;
}
const name = route.query.name;
const editor = ref<InstanceType<typeof EdomsEditor>>();
const { VITE_RUNTIME_PATH } = import.meta.env;
const previewVisible = ref(true);
const stageRect = ref({
  width: 1200,
  height: 950,
});
const previewUrl = computed(
  () => `${VITE_RUNTIME_PATH}/page/index.html?localPreview=1&page=${editor.value?.editorService.get('page').id}`
);
const loadData: RequestFunc<{ name: string }> = async ({ pageSize, current }) => {
  const { dataList = [], count } = await listPages({
    page: current,
    limit: pageSize,
    applicationId: route.query.applicationId as string,
    name: searchText.value,
  });
  active.value = dataList[0];
  dataList.forEach((item: any) => {
    item.isShowText = true;
  });
  return {
    data: dataList,
    total: Number(count),
  };
};

const goBack = () => {
  router.go(-1);
};

const editWrapper = ref();
const active = ref();
const handleActive = (item: any) => {
  active.value = item;
};

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
          pageId: active.value.pageId,
          applicationId: route.query.applicationId,
        },
      });
    },
  },
  {
    name: 'saveVersion',
    label: '保存为版本',
    action: async () => {
      versionVisible.value = true;
    },
  },
  {
    name: 'delete',
    label: '删除',
    action: () => {
      ElMessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await deletePage({
            pageIds: [active.value.pageId],
          });
          ElMessage.success('删除成功');
          gridList.value?.reload();
        })
        .catch(() => {});
    },
  },
];

const menus = [
  {
    name: 'rename',
    label: '重命名',
    icon: 'Operation',
    action: (item: any) => {
      item.isShowText = false;
    },
  },
  {
    name: 'edit',
    label: '编辑页面',
    icon: 'Edit',
    action: () => {
      router.push({
        path: '/editor',
      });
    },
  },
  {
    name: 'delete',
    label: '删除',
    icon: 'Delete',
    action: ({ pageId }: Page) => {
      ElMessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await deletePage({
            pageIds: [pageId],
          });
          ElMessage.success('删除成功');
          gridList.value?.reload();
        })
        .catch(() => {});
    },
  },
];
const handleMenuClick = (value: string | number, model: any) => {
  const menu = menus.find(({ name }) => name === value);
  menu?.action(model);
};
const handleTopMenuClick = (value: string | number) => {
  const menu = topMenus.find(({ name }) => name === value);
  menu?.action();
};
const handleChangeName = async (model: Page) => {
  await updatePage({
    pageId: Number(model.pageId),
    name: model.name,
    applicationId: model.applicationId,
  });
  model.isShowText = true;
  gridList.value?.reload();
};

const searchText = ref<string | null>(null);
const isSearch = ref<boolean>(false);

const handleShowSearchInput = () => {
  isSearch.value = true;
  search();
};

const search = () => {
  gridList.value?.reload();
  isSearch.value = false;
};

const newPageVisible = ref<boolean>(false);
const page = ref({
  name: '',
});
const rules = {
  name: [
    {
      required: true,
      message: '请输入页面名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 10,
      message: '页面名称长度1-10字符',
      trigger: 'blur',
    },
  ],
};
const versionRules = {
  name: [
    {
      required: true,
      message: '请输入版本名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: '版本名称长度1-20字符',
      trigger: 'blur',
    },
  ],
};
const form = ref<FormInstance>();

const version = ref({
  name: '',
});

const versionVisible = ref(false);
const versionForm = ref<FormInstance>();
const handleNewPage = () => {
  newPageVisible.value = true;
};

const handleConfirm = async () => {
  if (!form.value) return;
  try {
    await form.value?.validate();
    await createPage({
      name: page.value?.name,
      applicationId: route.query.applicationId as string,
    });
    ElMessage.success('页面创建成功');
    newPageVisible.value = false;
    form.value?.resetFields();
    gridList.value?.reload();
  } catch (e) {
    console.log(e);
  }
};
const handleVersionConfirm = async () => {
  if (!versionForm.value) return;
  try {
    await versionForm.value?.validate();
    await saveWithVersion({
      pageId: active.value.pageId,
      contentId: 1014433136007553024,
      name: version.value.name,
      description: active.value.description,
    });
    ElMessage.success('保存版本成功');
    versionVisible.value = false;
    versionForm.value?.resetFields();
  } catch (e) {
    console.log(e);
  }
};
const handleClose = () => {
  form.value?.resetFields();
};
const handleVersionClose = () => {
  versionForm.value?.resetFields();
};

const goEdit = () => {
  router.push({
    path: '/editor',
  });
};

const handleClearInput = () => {
  search();
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  :deep(.el-icon) {
    width: 1.5em !important;
    height: 1.5em !important;
    svg {
      width: 1.5em !important;
      height: 1.5em !important;
    }
  }
}

.active {
  background-color: #409eff;
}
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
  display: flex;
  .grid-list {
    margin-top: 10px;
    height: calc(100vh);
    overflow-y: auto;
    div {
      text-align: left;
    }
  }
  .right-section {
    width: 82%;
    .right-top-bar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-top: 10px;
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
