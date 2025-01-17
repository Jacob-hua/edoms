<template>
  <div class="container">
    <div class="header-top" @click="goBack">
      <el-icon class="header-icon" :size="23">
        <ArrowLeft />
      </el-icon>
      <span>{{ appInfo.name }}</span>
    </div>
    <section>
      <div class="section-left">
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane name="application">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20">
                  <Document />
                </el-icon>
                <span>{{ t('applicationSetting.应用信息') }}</span>
              </span>
            </template>
            <BasicInfo v-if="appInfoVisible" :app-info="appInfo" @success="goBack" />
          </el-tab-pane>
          <el-tab-pane v-if="accountStore.hasRole(['manager'])" name="advance">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20">
                  <Setting />
                </el-icon>
                <span>{{ t('applicationSetting.高级设置') }}</span>
              </span>
            </template>
            <AdvancedSetting :app-info="appInfo" @success="handleUpdateSuccess" />
          </el-tab-pane>
          <el-tab-pane name="version">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20">
                  <Document />
                </el-icon>
                <span>{{ t('applicationSetting.版本管理') }}</span>
              </span>
            </template>
            <VersionList v-if="activeName === 'version'" :app-info="appInfo" />
          </el-tab-pane>
          <el-tab-pane v-if="appInfoVisible && hasRole" :key="activeName" name="permission">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20"><HomeFilled /></el-icon>
                <span>{{ t('applicationSetting.权限管理') }}</span>
              </span>
            </template>
            <PermissionList :app-info="appInfo" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { LocationQueryValue } from 'vue-router';

import applicationApi, { GetApplicationRes } from '@/api/application';
import useAccountStore from '@/store/account';

import AdvancedSetting from './component/AdvancedSetting.vue';
import BasicInfo from './component/BasicInfo.vue';
import PermissionList from './component/permission/PermissionList.vue';
import VersionList from './component/version-setting/VersionList.vue';
const { t } = useI18n();

const accountStore = useAccountStore();
const route = useRoute();
const { go } = useRouter();
const appInfoVisible = ref<boolean>(false);
const activeName = ref<string>(route.query.defaultActive as string);

const appInfo = ref<GetApplicationRes>({
  applicationId: '',
  createBy: '',
  createTime: '',
  description: '',
  name: '',
  serviceAddress: '',
  tenantId: '',
  thumbnailId: '',
  secret: '',
  defaultVersionId: '',
  defaultVersionName: '',
  defaultVersionContentId: '',
  edomsRoleInfoDTO: {
    roleId: '',
    roleKey: '',
    roleName: '',
  },
});
const hasRole = ref<boolean>(false);
const getAppDetail = async (applicationId: LocationQueryValue | LocationQueryValue[]) => {
  const result = await applicationApi.getApplication({ applicationId } as { applicationId: string });
  appInfoVisible.value = true;
  appInfo.value = result;
  hasRole.value = [result.edomsRoleInfoDTO.roleKey].includes('manager');
};
const goBack = () => {
  go(-1);
};
const handleUpdateSuccess = () => {
  getAppDetail(route.query.applicationId);
};

getAppDetail(route.query.applicationId);
</script>

<style scoped lang="scss">
.container {
  .header-top {
    display: flex;
    align-items: center;

    .header-icon {
      cursor: pointer;
    }

    span {
      font-size: 16px;
      margin-left: 20px;
    }
  }

  section {
    .section-left {
      margin: 60px 0 0 100px;

      .custom-tabs-label {
        display: flex;
        align-items: center;
        margin-right: 30px;

        span {
          font-size: 16px;
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
