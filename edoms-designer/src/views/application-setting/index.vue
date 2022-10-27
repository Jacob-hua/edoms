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
            <AppInfo v-if="appInfoVisible" :app-info="appInfo" @back="goBack" />
          </el-tab-pane>
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20"><Setting /></el-icon>
                <span>高级设置</span>
              </span>
            </template>
            <AdvancedSetting />
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';

import AdvancedSetting from './component/AdvancedSetting.vue';
import AppInfo from './component/AppInfo.vue';
import { useSetting } from './useSetting';

const { appInfo, appInfoVisible, goBack } = useSetting(useRouter(), useRoute());
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
