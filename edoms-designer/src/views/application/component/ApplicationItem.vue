<template>
  <div class="app-wrapper">
    <div class="app-box">
      <PreviewImage :content-id="application.thumbnailId" @click="handleGoPage" />
      <div class="pop-menu">
        <PopMenu @menu-click="handleMenuClick">
          <PopMenuOption v-for="(menu, index) in menus" :key="index" :label="menu.label" :value="menu.name">
            <div class="pop-menu-item">
              <el-icon>
                <component :is="menu.icon" />
              </el-icon>
              <span>{{ menu.label }}</span>
            </div>
          </PopMenuOption>
        </PopMenu>
      </div>
    </div>
    <div>{{ application.name }}</div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

import type { ListApplicationsResItem } from '@/api/application';
import applicationApi from '@/api/application';
import PreviewImage from '@/components/ImagePreview.vue';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';

const props = withDefaults(
  defineProps<{
    application: ListApplicationsResItem;
  }>(),
  {}
);
const router = useRouter();

const menus = [
  {
    name: 'operation',
    label: '发布',
    icon: 'Operation',
    action: () => {
      ElMessageBox.confirm(`是否发布${props.application.name}?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await applicationApi.releaseApplication({
          applicationId: props.application.applicationId,
        });
        ElMessage.success('发布成功');
      });
    },
  },
  {
    name: 'setting',
    label: '设置',
    icon: 'Setting',
    action: () => {
      router.push({
        path: '/application/setting',
        query: {
          applicationId: props.application.applicationId,
        },
      });
    },
  },
];

const handleMenuClick = (value: string | number) => {
  const menu = menus.find(({ name }) => name === value);
  menu?.action();
};
const handleGoPage = () => {
  router.push({
    path: '/page',
    query: {
      applicationId: props.application.applicationId,
    },
  });
};
</script>

<style lang="scss" scoped>
.el-image {
  width: 195px;
  height: 195px;
}
.pop-menu-item {
  display: flex;
  align-items: center;
  span {
    margin-left: 15px;
  }
}
.app-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.app-box {
  text-align: center;
  width: 200px;
  height: 200px;
  border: 1px solid #000;
  cursor: pointer;
  img {
    width: 198px;
    height: 198px;
  }

  .pop-menu {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
