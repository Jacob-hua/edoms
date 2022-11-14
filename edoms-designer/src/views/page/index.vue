<template>
  <div class="page-container">
    <section class="left-section">
      <div class="header-top" @click="goBack">
        <el-icon class="header-icon" :size="23"><ArrowLeft /></el-icon>
        <span>陕汽冷站</span>
      </div>
      <div class="top-search">
        <p>页面列表</p>
        <div>
          <el-icon class="header-icon" :size="19" @click="handleShowSearchInput"><Search /></el-icon>
          <el-icon class="header-icon" :size="20" @click="handleNewPage"><Plus /></el-icon>
        </div>
      </div>
      <div class="search-wrapper"><el-input v-if="isSearch" v-model="searchText" @keyup.enter="search"></el-input></div>
      <GridList
        ref="gridList"
        class="grid-list"
        column-gap="20px"
        row-gap="20px"
        :page-size="999999"
        item-min-width="200px"
        :request="loadData"
      >
        <template #default="{ item }">
          <div class="item">
            <p v-if="item.isShowText">{{ item.name }}</p>
            <el-input v-if="!item.isShowText" v-model="item.name"></el-input>
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
          <PopMenu :width="350" @menu-click="handleTopMenuClick">
            <template #reference>
              <el-icon :size="28"><Menu /></el-icon>
            </template>
            <PopMenuOption v-for="(menu, index) in topMenus" :key="index" :label="menu.label" :value="menu.name">
              <div class="pop-menu-item">
                <span>{{ menu.label }}</span>
              </div>
            </PopMenuOption>
            <div class="createInfo">
              <p>张三创建于2022-09-12</p>
              <p>张三最近更新于 2022-09-12</p>
              <p>编辑者: 张三</p>
            </div>
          </PopMenu>
        </div>
      </div>
      <div ref="editWrapper" class="edit"><h1>页面预览</h1></div>
    </section>
  </div>
  <el-dialog v-model="newPageVisible" title="新增页面" width="30%" @close="handleClose">
    <span>
      <el-form ref="form" :model="page" :rules="rules">
        <el-form-item label="应用页名称" prop="name">
          <el-input v-model="page.name"></el-input>
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
          <el-input v-model="version.name"></el-input>
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
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, FormInstance } from 'element-plus';
import screenFull from 'screenfull';

import { createPage, deletePage, listPages, updatePage } from '@/api/page';
import GridList, { RequestFunc } from '@/components/GridList.vue';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';
const route = useRoute();
const router = useRouter();
const gridList = ref();

interface Page {
  pageId: bigint;
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

const loadData: RequestFunc<{ name: string }> = async ({ pageSize, current }) => {
  const { dataList = [], count } = await listPages({
    page: current,
    limit: pageSize,
    applicationId: route.query.applicationId as string,
    name: searchText.value,
  });
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
      });
    },
  },
  {
    name: 'saveVersion',
    label: '保存为版本',
    action: () => {
      versionVisible.value = true;
    },
  },
  {
    name: 'delete',
    label: '删除',
    action: () => {},
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
    action: () => {},
  },
  {
    name: 'delete',
    label: '删除',
    icon: 'Delete',
    action: async ({ pageId }: Page) => {
      await deletePage({
        pageIds: [pageId],
      });
      ElMessage.success('删除成功');
      gridList.value?.reload();
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
  searchText.value = '';
  isSearch.value = true;
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
</script>

<style lang="scss">
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
    height: calc(100vh - 180px);
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
