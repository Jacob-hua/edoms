<template>
  <div class="app-wrapper">
    <BaseLayout>
      <template #header>
        <div class="describe">
          <span>E-DOMS</span>
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
                    <span>{{ nickName }} - {{ currentTenant?.tenantName }}</span>
                    <p><span>应用数:</span> {{ applicationNumber }}</p>
                  </div>
                </div>
              </div>
              <PopMenuOption
                v-for="(menu, index) in menus"
                :key="index"
                :label="menu.label"
                :value="menu.name"
                :disabled="menu.disabled"
              >
                <div class="pop-menu-item">
                  <span>{{ menu.label }}</span>
                </div>
              </PopMenuOption>
              <div v-if="tenantListVisible" class="pop-level">
                <p
                  v-for="{ tenantName, tenantId, isActive } in tenantList"
                  :key="tenantId"
                  @click="handleTriggerTenant(tenantId)"
                >
                  {{ tenantName }} <el-icon v-show="isActive"><Select /></el-icon>
                </p>
              </div>
            </PopMenu>
          </div>
        </div>
      </template>
      <RouterView v-slot="{ Component }">
        <keep-alive :include="getRoutersComps">
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
import { RouterView, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import applicationApi from '@/api/application';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';
import useAccountStore from '@/store/account';
import useRoutersStore from '@/store/routers';

import BaseLayout from './BaseLayout.vue';

const router = useRouter();

const accountStore = useAccountStore();

const RoutersStore = useRoutersStore();

const { getRoutersComps } = storeToRefs(RoutersStore);

const { nickName, tenants, currentTenant } = storeToRefs(accountStore);

const tenantListVisible = ref<boolean>(false);

const applicationNumber = ref<number>();

const popMenuRef = ref();

const tenantList = computed(() =>
  tenants.value.map((item) => ({ ...item, isActive: currentTenant.value?.tenantId === item.tenantId }))
);

watch(
  () => accountStore.currentTenant?.tenantId,
  async () => {
    applicationNumber.value = await applicationApi.countApplication();
  },
  { immediate: true }
);

const menus = [
  {
    name: 'switch',
    label: '切换租户',
    icon: 'Operation',
    disabled: {
      clickEvent: true,
    },
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
    name: 'loginOut',
    label: '退出登录',
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

const handleMenuClick = (value: string | number) => {
  const menu = menus.find(({ name }) => name === value);
  menu?.action?.();
};

const handleMenuHover = (value: string | number) => {
  tenantListVisible.value = value === 'switch';
};

const handleTriggerTenant = async (tenantId: string) => {
  await accountStore.triggerTenant(tenantId);
  router.push({
    path: '/',
  });
  popMenuRef.value?.handleClose();
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
