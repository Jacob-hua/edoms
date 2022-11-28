<template>
  <div class="container">
    <div class="header-top" @click="goBack">
      <el-icon class="header-icon" :size="23"><ArrowLeft /></el-icon>
      <span>{{ appInfo.name }}</span>
    </div>
    <section>
      <div class="section-left">
        <el-tabs tab-position="left">
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20"><Document /></el-icon>
                <span>应用信息</span>
              </span>
            </template>
            <BasicInfo v-if="appInfoVisible" :app-info="appInfo" @success="goBack" />
          </el-tab-pane>
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20"><Setting /></el-icon>
                <span>高级设置</span>
              </span>
            </template>
            <AdvancedSetting :app-info="appInfo" />
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

import { getApplicationInfo } from '@/api/application';
import { ApplicationInfo } from '@/api/application/type';

import AdvancedSetting from './component/AdvancedSetting.vue';
import BasicInfo from './component/BasicInfo.vue';
const { go } = useRouter();
const appInfoVisible = ref<boolean>(false);
const appInfo = ref<ApplicationInfo>({
  applicationId: '',
  createBy: '',
  createTime: '',
  description: '',
  name: '',
  serviceAddress: '',
  tenantId: '',
  thumbnailId: '',
});
const getAppDetail = async (applicationId: LocationQueryValue | LocationQueryValue[]) => {
  const result = await getApplicationInfo({ applicationId } as { applicationId: string });
  appInfoVisible.value = true;
  appInfo.value = result;
};
const goBack = () => {
  go(-1);
};
getAppDetail(useRoute().query.applicationId);
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
