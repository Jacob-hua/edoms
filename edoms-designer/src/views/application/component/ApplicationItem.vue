<template>
  <div class="app-wrapper">
    <div class="app-box">
      <el-image :src="application.imgUrl">
        <template #error>
          <div class="image-slot">
            <img alt="" :src="NoData" />
          </div>
        </template>
      </el-image>
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

import { ApplicationInfo } from '@/api/application/type';
import NoData from '@/assets/img/no_data.png';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';

const props = withDefaults(
  defineProps<{
    application: ApplicationInfo;
  }>(),
  {}
);

const router = useRouter();

const menus = [
  {
    name: 'operation',
    label: '发布',
    icon: 'Operation',
    action: () => {},
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
  {
    name: 'model',
    label: 'CIM模型',
    icon: 'Setting',
    action: () => {
      router.push({
        path: '/model',
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
