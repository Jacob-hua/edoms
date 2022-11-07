<template>
  <div>
    <BaseLayout>
      <template #header>
        <div class="describe">
          <span>E-DOMS</span>
          <div class="pop-menu-wrapper">
            <PopMenu :width="350" @menu-click="handleMenuClick">
              <template #reference>
                <div class="avatar">
                  <el-avatar>
                    <el-icon :size="20"><Avatar /></el-icon>
                  </el-avatar>
                  <span>王麻子</span>
                </div>
              </template>
              <div class="top-bar">
                <div class="avatar">
                  <el-avatar>
                    <el-icon :size="20"><Avatar /></el-icon>
                  </el-avatar>
                  <div>
                    <span>王麻子-{{ tenantName }}</span>
                    <p><span>应用数:</span> 25 <span>发布数:</span> 16</p>
                  </div>
                </div>
              </div>
              <PopMenuOption v-for="(menu, index) in menus" :key="index" :label="menu.label" :value="menu.name">
                <div class="pop-menu-item" @click="handleShowLevel(menu.name)">
                  <span>{{ menu.label }}</span>
                </div>
              </PopMenuOption>
              <div v-show="level" class="pop-level">
                <p v-for="({ name, isSelected, id }, index) in levelList" :key="index" @click="handleLevel(id, name)">
                  {{ name }} <el-icon v-show="isSelected"><Select /></el-icon>
                </p>
              </div>
            </PopMenu>
          </div>
        </div>
      </template>
      <RouterView />
    </BaseLayout>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LayoutView',
};
</script>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';

import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';

import BaseLayout from './BaseLayout.vue';
const router = useRouter();
const menus = [
  {
    name: 'switch',
    label: '切换租户',
    icon: 'Operation',
    action: () => {},
  },

  {
    name: 'model',
    label: '租户模型',
    action: () => {
      router.push({
        path: '/model',
      });
    },
  },
  {
    name: 'user',
    label: '用户设置',
    action: () => {},
  },
  {
    name: 'loginOut',
    label: '退出登录',
    action: () => {},
  },
];
const handleMenuClick = (value: string | number) => {
  const menu = menus.find(({ name }) => name === value);
  menu?.action();
};
const levelList = ref([
  {
    id: Math.random(),
    name: '陕汽',
    isSelected: false,
  },
  {
    id: Math.random(),
    name: '喜来登',
    isSelected: false,
  },
]);
const level = ref<boolean>(false);

const tenantName = ref<string>('');

const handleShowLevel = (name: string) => {
  if (name === menus[0].name) {
    level.value = true;
    return;
  }
  level.value = false;
};
const handleLevel = (levelId: number, name: string) => {
  levelList.value.forEach((levelItem) => {
    levelItem.isSelected = levelId === levelItem.id;
  });
  tenantName.value = name;
};
</script>

<style lang="scss" scoped>
.top-bar {
  .avatar {
    display: flex;
    font-size: 16px;
    div {
      margin-left: 15px;
    }
  }
}
.pop-level {
  position: absolute;
  top: 30px;
  left: -212px;
  background-color: #ffffff;
  box-shadow: var(--el-box-shadow-light);
  p {
    width: 200px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    cursor: pointer;
    border-bottom: 1px solid #333;
  }
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
.describe {
  width: 100%;
  height: 100%;
  margin: 0 41px;
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .avatar {
    cursor: pointer;
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}
</style>
