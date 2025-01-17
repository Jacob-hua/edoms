<template>
  <div class="app-wrapper">
    <div class="app-box">
      <PreviewImage :content-id="application.thumbnailId" @click="handleGoPage" />
      <div class="pop-menu">
        <PopMenu @menu-click="handleMenuClick" @show="handleShow">
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
    <LongText :content="application.name" :content-style="{ width: '198px', fontSize: '15px' }"></LongText>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import type { ListApplicationsResItem } from '@/api/application';
import PreviewImage from '@/components/ImagePreview.vue';
import LongText from '@/components/LongText.vue';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';
const { t } = useI18n();

const props = defineProps<{
  application: ListApplicationsResItem;
}>();

const router = useRouter();
const hasRole = ref<boolean>(false);
const menus = computed(() => {
  if (!hasRole.value) {
    return [
      {
        name: 'application',
        label: t('application.设置'),
        icon: 'Setting',
        action: () => {
          router.push({
            path: '/application/setting',
            query: {
              applicationId: props.application.applicationId,
              defaultActive: 'application',
            },
          });
        },
      },
      {
        name: 'version',
        label: t('application.版本'),
        icon: 'Setting',
        action: () => {
          router.push({
            path: '/application/setting',
            query: {
              applicationId: props.application.applicationId,
              defaultActive: 'version',
            },
          });
        },
      },
    ];
  }
  return [
    {
      name: 'application',
      label: t('application.设置'),
      icon: 'Setting',
      action: () => {
        router.push({
          path: '/application/setting',
          query: {
            applicationId: props.application.applicationId,
            defaultActive: 'application',
          },
        });
      },
    },
    {
      name: 'version',
      label: t('application.版本'),
      icon: 'Setting',
      action: () => {
        router.push({
          path: '/application/setting',
          query: {
            applicationId: props.application.applicationId,
            defaultActive: 'version',
          },
        });
      },
    },
    {
      name: 'permission',
      label: t('application.权限'),
      icon: 'Setting',
      action: () => {
        router.push({
          path: '/application/setting',
          query: {
            applicationId: props.application.applicationId,
            activeName: 'permission',
            defaultActive: 'permission',
          },
        });
      },
    },
  ];
});

const handleMenuClick = (value: (string | number)[]) => {
  const menu = menus?.value?.find(({ name }) => name === value[0]);
  menu?.action();
};
const handleShow = async () => {
  hasRole.value = [props.application.roleKey].includes('manager');
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
