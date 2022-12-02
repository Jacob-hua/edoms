<template>
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

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

import { deletePage, updatePage } from '@/api/page';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';
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
const props = defineProps<{
  item: any;
  active: any;
}>();

const router = useRouter();
const route = useRoute();
const emit = defineEmits<{
  (event: 'success'): void;
  (event: 'changeActive', item: any): void;
}>();

const menus = [
  {
    name: 'rename',
    label: '重命名',
    icon: 'Operation',
    action: (item: Page) => {
      item.isShowText = false;
    },
  },
  {
    name: 'edit',
    label: '编辑页面',
    icon: 'Edit',
    action: () => {
      goEdit();
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
          emit('success');
        })
        .catch(() => {});
    },
  },
];
const handleActive = (item: any) => {
  emit('changeActive', item);
};
const handleMenuClick = (value: string | number, model: any) => {
  const menu = menus.find(({ name }) => name === value);
  menu?.action(model);
};
const handleChangeName = async (model: Page) => {
  await updatePage({
    pageId: Number(model.pageId),
    name: model.name,
    applicationId: route.query.applicationId as string,
  });
  model.isShowText = true;
  ElMessage.success('更新成功');
  emit('success');
};
const goEdit = () => {
  router.push({
    path: '/editor',
    query: {
      pageId: props.active.pageId,
    },
  });
};
</script>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
}
</style>
