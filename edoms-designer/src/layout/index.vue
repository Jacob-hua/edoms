<template>
  <div class="app-wrapper">
    <BaseLayout>
      <template #header>
        <div class="describe">
          <span>E-DOMs</span>
          <div class="pop-menu-wrapper">
            <PopMenu
              ref="popMenuRef"
              :width="350"
              @hide="handleMenuHide"
              @menu-click="handleMenuClick"
              @menu-hover="handleMenuHover"
            >
              <template #reference>
                <div class="avatar">
                  <span>{{ nickName }}</span>
                </div>
              </template>
              <div class="top-bar">
                <div class="avatar">
                  <div>
                    <span>{{ nickName }} - {{ currentTenant?.proName }}</span>
                    <p>
                      <span>{{ t('application.应用数') }}:</span> {{ applicationNumber }}
                    </p>
                  </div>
                </div>
              </div>
              <template v-for="(menu, index) in menus" :key="index">
                <SubPopMenuOption v-if="menu.subMenu" :label="menu.label" :value="menu.value">
                  <template #title>
                    <div class="pop-menu-item">
                      <span>{{ menu.label }}</span>
                    </div>
                  </template>
                  <PopMenuOption
                    v-for="(submenu, index) in menu.subMenu"
                    :key="index"
                    :label="submenu.label"
                    :value="submenu.value"
                  >
                    <div class="pop-menu-item">
                      <span>{{ submenu.label }}</span>
                      <el-icon v-show="currentTenant?.tenantId === submenu.value"><Select /></el-icon>
                    </div>
                  </PopMenuOption>
                </SubPopMenuOption>
                <PopMenuOption v-else :label="menu.label" :value="menu.value">
                  <div class="pop-menu-item">
                    <span>{{ menu.label }}</span>
                  </div>
                </PopMenuOption>
              </template>
            </PopMenu>
          </div>
        </div>
      </template>
      <RouterView v-slot="{ Component }">
        <keep-alive :include="keepAliveComps">
          <component :is="Component"></component>
        </keep-alive>
      </RouterView>
    </BaseLayout>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LayoutView',
};
</script>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import applicationApi from '@/api/application';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';
import SubPopMenuOption from '@/components/SubPopMenuOption.vue';
import useAccountStore from '@/store/account';
import useRouterStore from '@/store/router';

import BaseLayout from './BaseLayout.vue';
export interface Menu {
  value: string | number;
  label: string;
  disabled?: object;
  subMenu?: Menu[];
  icon?: string;
  action?: (value?: any) => void;
}
const { t } = useI18n();

const router = useRouter();

const accountStore = useAccountStore();

const routersStore = useRouterStore();

const { keepAliveComps } = storeToRefs(routersStore);

const { nickName, tenants, currentTenant } = storeToRefs(accountStore);

const tenantListVisible = ref<boolean>(false);

const applicationNumber = ref<number>();

const popMenuRef = ref();

const tenantList = computed(() =>
  tenants.value.map((item) => ({
    value: item.tenantId,
    label: item.proName,
    action: (value: string) => {
      accountStore.triggerTenant(value);
      router.push({
        path: '/',
      });
    },
  }))
);

watch(
  () => accountStore.currentTenant?.tenantId,
  async () => {
    applicationNumber.value = await applicationApi.countApplication();
  },
  { immediate: true }
);

const menus: Menu[] = [
  {
    value: 'switch',
    label: t('application.切换项目'),
    icon: 'Operation',
    disabled: {
      clickEvent: true,
    },
    subMenu: tenantList.value,
  },
  // {
  //   value: 'model',
  //   label: '项目模型',
  //   action: () => {
  //     router.push({
  //       path: '/model',
  //     });
  //   },
  // },
  {
    value: 'loginOut',
    label: t('application.退出登录'),
    action: () => {
      accountStore.logout();
      router.push({
        path: '/login',
      });
    },
  },
];

const handleMenuHide = () => {
  tenantListVisible.value = false;
};

const getTargetMenu = (menus: Menu[], values: (string | number)[]): Menu | undefined => {
  if (values.length == 1) {
    return menus.find(({ value }) => value === values[0]);
  }
  const nodeValue = values.shift();
  const menu = menus.find(({ value }) => value === nodeValue);
  if (menu?.subMenu) {
    return getTargetMenu(menu.subMenu, values);
  }
  return;
};

const handleMenuClick = (values: (string | number)[]) => {
  const menu = getTargetMenu(menus, values);
  menu?.action?.(menu.value);
};

const handleMenuHover = (value: string | number) => {
  tenantListVisible.value = value === 'switch';
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  width: 100%;
}
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
