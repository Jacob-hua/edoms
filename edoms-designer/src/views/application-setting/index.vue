<template>
  <div class="container">
    <div class="header-top" @click="goBack">
      <el-icon class="header-icon" :size="23"><ArrowLeft /></el-icon>
      <span>{{ appInfo.name }}</span>
    </div>
    <section>
      <div class="section-left">
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane :key="activeName" name="application">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20"><Document /></el-icon>
                <span>应用信息</span>
              </span>
            </template>
            <BasicInfo v-if="appInfoVisible" :app-info="appInfo" @success="goBack" />
          </el-tab-pane>
          <el-tab-pane :key="activeName" name="advance">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20"><Setting /></el-icon>
                <span>高级设置</span>
              </span>
            </template>
            <AdvancedSetting :app-info="appInfo" @success="handleUpdateSuccess" />
          </el-tab-pane>
          <el-tab-pane :key="activeName" name="version">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20"><Document /></el-icon>
                <span>版本管理</span>
              </span>
            </template>
            <VersionList :app-info="appInfo" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LocationQueryValue } from 'vue-router';

import applicationApi, { GetApplicationRes } from '@/api/application';

import AdvancedSetting from './component/AdvancedSetting.vue';
import BasicInfo from './component/BasicInfo.vue';
import VersionList from './component/version-setting/VersionList.vue';

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

const getAppDetail = async (applicationId: LocationQueryValue | LocationQueryValue[]) => {
  const result = await applicationApi.getApplication({ applicationId } as { applicationId: string });
  appInfoVisible.value = true;
  appInfo.value = result;
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
