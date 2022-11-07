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
    <section class="right-section"></section>
  </div>
  <el-dialog v-model="newPageVisible" title="Tips" width="30%">
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
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { FormInstance } from 'element-plus';

import GridList, { RequestFunc } from '@/components/GridList.vue';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';

const router = useRouter();

const gridList = ref(null);
const loadData: RequestFunc<{ name: string }> = async () => {
  const dataSource = [
    {
      id: Math.random(),
      name: `模型表1`,
      isShowText: true,
    },
    {
      id: Math.random(),
      name: '模型表2',
      isShowText: true,
    },
    {
      id: Math.random(),
      name: '模型表3',
      isShowText: true,
    },
    {
      id: Math.random(),
      name: '模型表4',
      isShowText: true,
    },
  ];
  return {
    data: dataSource,
    total: dataSource.length,
  };
};

const goBack = () => {
  router.go(-1);
};

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
    action: () => {},
  },
];
const handleMenuClick = (value: string | number, model: any) => {
  const menu = menus.find(({ name }) => name === value);
  menu?.action(model);
};

const handleChangeName = (model: any) => {
  model.isShowText = true;
};

const searchText = ref<string>('');
const isSearch = ref<boolean>(false);

const handleShowSearchInput = () => {
  searchText.value = '';
  isSearch.value = true;
};

const search = () => {
  console.log('搜索', searchText.value);
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
      message: '请输入应用名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 10,
      message: '应用名称长度1-10字符',
      trigger: 'blur',
    },
  ],
};
const form = ref<FormInstance>();
const handleNewPage = () => {
  newPageVisible.value = true;
};

const handleConfirm = async () => {
  if (!form.value) return;
  try {
    await form.value?.validate();
    newPageVisible.value = false;
  } catch (e) {
    console.log(e);
  }
};
</script>

<style lang="scss">
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
    height: calc(100vh - 160px);
    overflow-y: auto;
    div {
      text-align: left;
    }
  }
  .right-section {
    width: 82%;
  }
}
</style>
